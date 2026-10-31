/* =========================================================
   [수정] 닥터아담 주문 로직 — 시안용 '백엔드'
   장바구니 · 배송 약속(도착 예정 시각) · 정기배송 일정 · 금액 · 주문서 검증 · 주문 생성
   - 화면(shop.js, checkout.html)은 OrderAPI 함수만 불러요. 실제 서버를 붙일 때는
     quote·create 안쪽만 아래 API 호출로 바꾸면 돼요.
       GET  /api/delivery-quote?zip=04524&mode=parcel     → quote() 결과
       POST /api/orders { type, lines, weeks, zip, addr1, addr2, mode, pay, … } → create() 결과
   - 테스트: dreve-portfolio 폴더에서 node --test (tests/*.test.js를 찾아 돌려요)
   ========================================================= */
(function (root, make) {
  const api = make();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.OrderAPI = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* [수정] 배송·금액 정책 — 숫자는 시안 가정이에요. 실제 물류 계약에 맞춰 바꾸세요. */
  const POLICY = {
    cutoff: 23 * 60,     // 밤 11시 전 결제까지 오늘 주문으로 받아요 (컬리 샛별배송 마감과 같은 시각)
    packDays: 1,         // 주문 다음 영업일에 포장·출고 → 보통 주문 후 2일째 도착
    modes: {             // 예상 도착 시각이 나올 수 있는 범위 (분). 약속은 이 시각을 정시로 올려요
      dawn:   { label: '새벽배송', note: '출근 전에 받아요', area: '서울·경기·인천', from: 2 * 60, to: 6 * 60 + 40 },
      parcel: { label: '택배',     note: '낮에 받아요',     area: '전국',          from: 10 * 60, to: 18 * 60 + 40 },
    },
    freeOver: 30000,     // 한 번 구매: 3만원 이상 무료배송, 아래면 배송비. 정기배송은 늘 무료배송 (가정)
    shipFee: 3000,
    jejuFee: 3000,       // 제주 추가 배송비 (가정)
    jejuExtraDays: 1,
    coupon: { amount: 10000, minOrder: 30000, hours: 72, name: '가입 축하 1만원 쿠폰' }, // 회원가입 쿠폰 (가정)
    cycles: [2, 4, 6],   // 정기배송 주기(주)
  };

  /* [확인 필요] 우편번호 앞 두 자리 → 시·도. 인천(21~23)은 인천시 안내로 확인했고, 나머지는 우정사업본부 표로 최종 확인해요. */
  const SIDO = [[1, 9, '서울'], [10, 18, '경기'], [21, 23, '인천'], [24, 26, '강원'], [27, 29, '충북'], [30, 30, '세종'],
    [31, 33, '충남'], [34, 35, '대전'], [36, 40, '경북'], [41, 43, '대구'], [44, 45, '울산'], [46, 49, '부산'],
    [50, 53, '경남'], [54, 56, '전북'], [57, 60, '전남'], [61, 62, '광주'], [63, 63, '제주']];
  const DAWN_AREA = ['서울', '경기', '인천'];

  function regionOf(zip) {
    const z = String(zip || '').trim();
    if (!/^\d{5}$/.test(z)) return null;
    const n = +z.slice(0, 2);
    const hit = SIDO.find(([a, b]) => n >= a && n <= b);
    if (!hit) return null;
    return { sido: hit[2], dawn: DAWN_AREA.includes(hit[2]), jeju: hit[2] === '제주' };
  }

  /* [수정] 쉬는 날 (2026-11 ~ 2027-12, 주말과 겹친 날 포함). 출처: 2027 공휴일 정리 기사.
     [확인 필요] 최종은 인사혁신처 월력요항으로 확인 · 2027 부처님오신날(5/13) · 노동절·제헌절 공휴일 여부 */
  const HOLIDAYS = new Set([
    '2026-12-25',
    '2027-01-01', '2027-02-06', '2027-02-07', '2027-02-08', '2027-02-09', '2027-03-01', '2027-05-05', '2027-05-13',
    '2027-06-06', '2027-08-15', '2027-08-16', '2027-09-14', '2027-09-15', '2027-09-16', '2027-10-03', '2027-10-04',
    '2027-10-09', '2027-10-11', '2027-12-25', '2027-12-27',
  ]);

  /* 날짜는 모두 한국 시간 'YYYY-MM-DD' 문자열로 다뤄요 */
  const KST = 9 * 36e5;
  function kst(ms) {
    const d = new Date(ms + KST);
    return { date: d.toISOString().slice(0, 10), min: d.getUTCHours() * 60 + d.getUTCMinutes() };
  }
  function addDays(date, n) {
    const d = new Date(date + 'T00:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }
  const dow = date => new Date(date + 'T00:00:00Z').getUTCDay();
  const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  /* 포장·출고: 월~금 (공휴일 제외) */
  const isWorkday = date => dow(date) % 6 !== 0 && !HOLIDAYS.has(date);
  /* 도착: 택배 월~토, 새벽배송 매일. 공휴일은 둘 다 쉬어요 [확인 필요: 택배사·새벽배송 대행 계약] */
  const deliversOn = (mode, date) => !HOLIDAYS.has(date) && (mode === 'dawn' || dow(date) !== 0);

  /* 약속 시각: 예상 도착 시각을 정시로 올려요. 오후 3시 30분 → 오후 4시까지, 오전 3시 30분 → 오전 4시까지 */
  const ceilHour = min => Math.ceil(min / 60) * 60;
  function hourLabel(min) {
    const h = Math.floor(min / 60) % 24;
    if (h === 0) return '밤 12시';
    if (h === 12) return '낮 12시';
    return (h < 12 ? '오전 ' : '오후 ') + (h % 12) + '시';
  }
  const WD = '일월화수목금토';
  function dateLabel(date) {
    const [, m, d] = date.split('-').map(Number);
    return `${m}월 ${d}일(${WD[dow(date)]})`;
  }
  const dayWord = (date, today) => ['오늘', '내일', '모레'][daysBetween(today, date)] || '';

  function hash(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967296;
  }
  /* 예상 도착 시각: 실제로는 택배사가 그날 배송 경로 순서로 알려 줘요.
     시안에선 우편번호·날짜로 10분 단위 시각을 흉내 내요 (같은 주소·같은 날이면 늘 같은 값). */
  function routeEta(zip, date, mode) {
    const m = POLICY.modes[mode];
    const steps = Math.floor((m.to - m.from) / 10);
    return m.from + Math.floor(hash(`${zip}|${date}|${mode}`) * (steps + 1)) * 10;
  }
  const promise = (date, eta) => `${dateLabel(date)} ${hourLabel(ceilHour(eta))}까지`;

  /* 배송 약속 계산 (GET /api/delivery-quote) */
  function quote({ zip, mode = 'parcel', now = Date.now() }) {
    const region = regionOf(zip);
    if (!region) return { ok: false, code: 'ZIP', message: '우편번호 5자리를 확인해 주세요.' };
    if (!POLICY.modes[mode]) return { ok: false, code: 'MODE', region, message: '배송 방법을 골라 주세요.' };
    if (mode === 'dawn' && !region.dawn) return { ok: false, code: 'AREA', region, message: '새벽배송은 서울·경기·인천에서 받을 수 있어요.' };
    const t = kst(now);
    const beforeCutoff = t.min < POLICY.cutoff;
    const orderDate = beforeCutoff ? t.date : addDays(t.date, 1);
    let shipDate = orderDate;
    for (let i = 0; i < POLICY.packDays;) { shipDate = addDays(shipDate, 1); if (isWorkday(shipDate)) i++; }
    let arriveDate = shipDate;
    const transit = 1 + (region.jeju ? POLICY.jejuExtraDays : 0);
    for (let i = 0; i < transit;) { arriveDate = addDays(arriveDate, 1); if (deliversOn(mode, arriveDate)) i++; }
    const eta = routeEta(zip, arriveDate, mode);
    const left = (beforeCutoff ? POLICY.cutoff : POLICY.cutoff + 1440) - t.min;
    const word = dayWord(arriveDate, t.date);
    return {
      ok: true, mode, region, today: t.date, orderDate, shipDate, arriveDate, eta, by: ceilHour(eta),
      byLabel: promise(arriveDate, eta),
      text: `${word ? word + ' ' : ''}${promise(arriveDate, eta)} 배송될 예정이에요`,
      cutoffLabel: `${beforeCutoff ? '오늘' : '내일'} 밤 11시 전에 결제하면`,
      leftLabel: `${Math.floor(left / 60)}시간 ${left % 60}분 남았어요`,
    };
  }

  /* 정기배송 일정: 첫 도착일부터 주기마다. 쉬는 날이면 다음 배송일로 미뤄요 */
  function schedule(first, { zip, mode = 'parcel', weeks = 4, count = 3 }) {
    return Array.from({ length: count }, (_, k) => {
      let d = addDays(first, 7 * weeks * k);
      while (!deliversOn(mode, d)) d = addDays(d, 1);
      const eta = routeEta(zip, d, mode);
      return { date: d, by: ceilHour(eta), label: promise(d, eta) };
    });
  }

  /* 금액: lines = [{ id, price, qty }]. 가입 쿠폰은 상품 금액이 기준 이상일 때만 빼요 */
  const couponFits = (c, subtotal, now = Date.now()) => !!c && !c.usedAt && c.expiresAt > now && subtotal >= c.minOrder;
  function price(lines, { type = 'once', region = null, coupon = null, now = Date.now() } = {}) {
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const off = couponFits(coupon, subtotal, now) ? coupon.amount : 0;
    const base = type === 'sub' || subtotal >= POLICY.freeOver ? 0 : POLICY.shipFee;
    const shipping = subtotal ? base + (region && region.jeju ? POLICY.jejuFee : 0) : 0;
    return { subtotal, coupon: off, shipping, total: subtotal - off + shipping, freeLeft: subtotal && base ? POLICY.freeOver - subtotal : 0 };
  }

  /* 주문서 검증 (서버에서도 똑같이 다시 검사해요) */
  const PAY = ['card', 'kakaopay', 'naverpay', 'tosspay'];
  function validate(f) {
    const e = {};
    if (!f.lines || !f.lines.length) e.lines = '주문할 상품이 없어요.';
    if (!f.name || f.name.trim().length < 2) e.name = '받는 분 이름을 2자 이상 적어 주세요.';
    if (!/^01[016789]-?\d{3,4}-?\d{4}$/.test((f.phone || '').trim())) e.phone = '휴대폰 번호를 확인해 주세요. 예: 010-1234-5678';
    const region = regionOf(f.zip);
    if (!region) e.zip = '우편번호 5자리를 확인해 주세요.';
    if (!f.addr1 || !f.addr1.trim()) e.addr1 = '주소를 입력해 주세요.';
    if (!f.addr2 || !f.addr2.trim()) e.addr2 = '동·호수 같은 상세 주소를 입력해 주세요.';
    if (!POLICY.modes[f.mode]) e.mode = '배송 방법을 골라 주세요.';
    if (f.mode === 'dawn') {
      if (region && !region.dawn) e.mode = '새벽배송은 서울·경기·인천에서 받을 수 있어요. 택배를 골라 주세요.';
      if (f.gate === 'code' && !/^[0-9#*]{2,12}$/.test((f.gateCode || '').trim())) e.gateCode = '공동현관 비밀번호를 적어 주세요.';
    }
    if (f.type === 'sub' && !POLICY.cycles.includes(+f.weeks)) e.weeks = '배송 주기를 골라 주세요.';
    if (!PAY.includes(f.pay)) e.pay = '결제 수단을 골라 주세요.';
    if (f.pay === 'card' && !f.issuer) e.issuer = '카드사를 골라 주세요.';
    if (!f.agree) e.agree = '필수 동의에 체크해 주세요.';
    return { ok: !Object.keys(e).length, errors: e };
  }

  /* 브라우저 저장소 (사생활 보호 모드 등에서 막히면 조용히 넘어가요) */
  function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (_) { return fallback; } }
  function write(key, v) { try { localStorage.setItem(key, JSON.stringify(v)); } catch (_) { /* 저장 안 돼도 화면은 그대로 */ } }
  const maskPhone = p => p.replace(/^(\d{3})-?(\d{3,4})-?(\d{4})$/, '$1-****-$3');

  /* 주문 생성 (POST /api/orders) — 시안에선 결제 승인 뒤 브라우저에만 저장해요 */
  async function create(f, { now = Date.now(), latency = 600 } = {}) {
    await new Promise(r => setTimeout(r, latency));
    const v = validate(f);
    if (!v.ok) { const err = new Error('VALIDATION'); err.errors = v.errors; throw err; }
    const q = quote({ zip: f.zip, mode: f.mode, now });
    const c = f.useCoupon ? coupons.valid() : null;
    const order = {
      id: `DA${q.orderDate.replace(/-/g, '')}-${1000 + Math.floor(hash(f.phone + now) * 9000)}`,
      type: f.type, status: f.type === 'sub' ? 'ACTIVE' : 'PAID', createdAt: new Date(now).toISOString(),
      lines: f.lines.map(({ id, name, price: p, qty }) => ({ id, name, price: p, qty })),
      amount: price(f.lines, { type: f.type, region: q.region, coupon: c }),
      delivery: q,
      weeks: f.type === 'sub' ? +f.weeks : null,
      next: f.type === 'sub' ? schedule(q.arriveDate, { zip: f.zip, mode: f.mode, weeks: +f.weeks, count: 4 }).slice(1) : [],
      shipTo: { name: f.name.trim(), phone: maskPhone(f.phone.trim()), zip: f.zip, addr1: f.addr1.trim(), addr2: f.addr2.trim() },
      pay: { method: f.pay, issuer: f.issuer || null },
    };
    write('dradam.orders', read('dradam.orders', []).concat(order));
    write('dradam.zip', f.zip);
    if (f.fromCart) write('dradam.cart', []);
    if (order.amount.coupon) coupons.use(c.code);
    return order;
  }

  /* 장바구니: [{ id, qty }] — 페이지를 옮겨도 남아 있어요 */
  const cart = {
    get: () => read('dradam.cart', []).filter(l => l && l.id && l.qty > 0),
    add(id, n = 1) {
      const c = cart.get();
      const l = c.find(x => x.id === id);
      if (l) l.qty = Math.min(9, l.qty + n); else c.push({ id, qty: Math.min(9, n) });
      write('dradam.cart', c);
      return c;
    },
    set(id, qty) {
      const c = cart.get().map(x => (x.id === id ? { id, qty: Math.min(9, qty) } : x)).filter(x => x.qty > 0);
      write('dradam.cart', c);
      return c;
    },
    clear() { write('dradam.cart', []); return []; },
    count: () => cart.get().reduce((s, l) => s + l.qty, 0),
  };
  /* [수정] 가입 쿠폰 — 받은 때부터 72시간. 끝나는 시각도 정시로 올려요 */
  const coupons = {
    all: () => read('dradam.coupons', []),
    valid: (now = Date.now()) => coupons.all().find(c => !c.usedAt && c.expiresAt > now) || null,
    issue(now = Date.now()) {
      const have = coupons.valid(now);
      if (have) return have;
      const P = POLICY.coupon;
      const c = { code: 'WELCOME10K', name: P.name, amount: P.amount, minOrder: P.minOrder, issuedAt: now,
        expiresAt: Math.ceil((now + P.hours * 36e5) / 36e5) * 36e5, usedAt: null };
      write('dradam.coupons', coupons.all().concat(c));
      return c;
    },
    use(code, now = Date.now()) {
      write('dradam.coupons', coupons.all().map(c => (c.code === code && !c.usedAt ? Object.assign({}, c, { usedAt: now }) : c)));
    },
  };
  const pad2 = n => String(n).padStart(2, '0');
  function couponLeft(c, now = Date.now()) {
    const s = Math.max(0, Math.floor((c.expiresAt - now) / 1000));
    return { seconds: s, label: s ? `${Math.floor(s / 3600)}시간 ${pad2(Math.floor(s / 60) % 60)}분 ${pad2(s % 60)}초 남았어요` : '사용 기간이 끝났어요' };
  }
  function couponEnds(c) {
    const t = kst(c.expiresAt);
    return t.min === 0 ? `${dateLabel(addDays(t.date, -1))} 밤 12시까지` : `${dateLabel(t.date)} ${hourLabel(t.min)}까지`;
  }
  /* 회원가입 — 시안이라 무엇을 입력해도(비워 둬도) 가입되고, 바로 쿠폰을 줘요 */
  const member = {
    get: () => read('dradam.member', null),
    join(f = {}, now = Date.now()) {
      const m = { name: String(f.name || '').trim().slice(0, 20) || '고객', contact: String(f.contact || '').trim().slice(0, 60), joinedAt: now };
      write('dradam.member', m);
      return { member: m, coupon: coupons.issue(now) };
    },
  };
  const prefs = { zip: () => read('dradam.zip', ''), setZip: z => write('dradam.zip', z) };

  return { POLICY, HOLIDAYS, regionOf, kst, addDays, isWorkday, deliversOn, ceilHour, hourLabel, dateLabel, dayWord,
    routeEta, quote, schedule, price, validate, create, cart, prefs, maskPhone, coupons, couponLeft, couponEnds, member };
});
