/* 주문 로직 테스트 — dreve-portfolio 폴더에서: node --test */
const test = require('node:test');
const assert = require('node:assert/strict');
const O = require('../order.js');

const at = s => Date.parse(s + ':00+09:00'); // 한국 시간
const q = (now, zip = '04524', mode = 'parcel') => O.quote({ now: at(now), zip, mode });

test('약속 시각은 정시로 올려요: 오후 3시 30분 → 오후 4시, 오전 3시 30분 → 오전 4시', () => {
  assert.equal(O.hourLabel(O.ceilHour(15 * 60 + 30)), '오후 4시');
  assert.equal(O.hourLabel(O.ceilHour(3 * 60 + 30)), '오전 4시');
  assert.equal(O.hourLabel(O.ceilHour(16 * 60)), '오후 4시');
  assert.equal(O.hourLabel(O.ceilHour(11 * 60 + 10)), '낮 12시');
});

test('평일 밤 12시 전 결제 → 다음 영업일 출고 → 주문 후 2일째 도착', () => {
  const r = q('2026-11-04T23:59');
  assert.equal(r.shipDate, '2026-11-05');
  assert.equal(r.arriveDate, '2026-11-06');
  assert.match(r.text, /^모레 11월 6일\(금\) (오전|오후|낮) \d+시까지 배송될 예정이에요$/);
});

test('밤 12시가 지나면 다음 날 주문으로 받고, 마감까지 남은 시간을 알려 줘요', () => {
  assert.equal(q('2026-11-05T00:00').arriveDate, '2026-11-07');
  const r = q('2026-11-04T23:43');
  assert.equal(r.cutoffLabel, '오늘 밤 12시 전에 결제하면');
  assert.equal(r.leftLabel, '17분 남았어요');
  assert.equal(q('2026-11-04T10:00').leftLabel, '14시간 0분 남았어요');
});

test('금요일·주말 주문은 월요일 출고, 화요일 도착', () => {
  assert.equal(q('2026-11-06T10:00').arriveDate, '2026-11-10');
  assert.equal(q('2026-10-31T14:00').arriveDate, '2026-11-03');
});

test('공휴일은 포장도 도착도 쉬어요 (성탄절, 설 연휴)', () => {
  assert.equal(q('2026-12-23T12:00').arriveDate, '2026-12-26');
  assert.equal(q('2026-12-24T09:00').arriveDate, '2026-12-29');
  assert.equal(q('2027-02-05T10:00').arriveDate, '2027-02-11');
});

test('제주는 하루 더 걸리고, 새벽배송은 수도권만 돼요', () => {
  assert.equal(q('2026-11-04T10:00', '63122').arriveDate, '2026-11-07');
  const r = q('2026-11-04T10:00', '63122', 'dawn');
  assert.equal(r.ok, false);
  assert.equal(r.code, 'AREA');
  assert.equal(q('2026-11-04T10:00', '04524', 'dawn').ok, true);
});

test('약속은 늘 정시이고, 예상 시각보다 1시간 안쪽으로 늦어요. 새벽배송은 오전 7시를 넘지 않아요', () => {
  const zips = ['04524', '13494', '21554', '47545', '63122', '35242', '61945'];
  for (let d = 0; d < 60; d++) {
    const day = O.addDays('2026-11-01', d);
    for (const zip of zips) for (const mode of ['dawn', 'parcel']) {
      const r = O.quote({ now: at(day + 'T09:00'), zip, mode });
      if (!r.ok) continue;
      assert.equal(r.by % 60, 0);
      assert.ok(r.by >= r.eta && r.by - r.eta < 60);
      assert.ok(mode === 'dawn' ? r.by <= 7 * 60 : r.by <= 19 * 60);
    }
  }
});

test('우편번호로 지역을 찾아요', () => {
  assert.deepEqual(O.regionOf('04524'), { sido: '서울', dawn: true, jeju: false });
  assert.equal(O.regionOf('21554').sido, '인천');
  assert.equal(O.regionOf('63122').jeju, true);
  assert.equal(O.regionOf('47545').dawn, false);
  for (const bad of ['1234', '19999', '00123', 'abcde', '']) assert.equal(O.regionOf(bad), null);
});

test('정기배송 일정: 주기마다, 쉬는 날이면 다음 배송일로', () => {
  const s = O.schedule('2026-11-27', { zip: '04524', mode: 'parcel', weeks: 4, count: 3 });
  assert.deepEqual(s.map(x => x.date), ['2026-11-27', '2026-12-26', '2027-01-22']);
});

test('금액: 3만원 이상·첫 주문·정기배송은 무료배송, 제주도 추가 배송비 없음', () => {
  const three = [{ price: 19800, qty: 3 }], one = [{ price: 19800, qty: 1 }];
  assert.deepEqual(O.price(three), { subtotal: 59400, coupon: 0, shipping: 0, freeWhy: 'over', total: 59400, freeLeft: 0 });
  assert.deepEqual(O.price(one), { subtotal: 19800, coupon: 0, shipping: 3000, freeWhy: '', total: 22800, freeLeft: 10200 });
  assert.equal(O.price(one, { first: true }).freeWhy, 'first');
  assert.equal(O.price(one, { first: true }).total, 19800);
  assert.equal(O.price(one, { type: 'sub' }).freeWhy, 'sub');
  assert.equal(O.price(three, { type: 'sub', region: O.regionOf('63122') }).shipping, 0);
});

test('가입 쿠폰: 루틴 세 가지 59,400원 → 49,400원, 3만원 미만·기간 지남이면 안 빠져요', () => {
  const now = at('2026-11-04T10:30');
  const c = { amount: 10000, minOrder: 30000, expiresAt: now + 36e5, usedAt: null };
  assert.equal(O.price([{ price: 19800, qty: 3 }], { type: 'sub', coupon: c, now }).total, 49400);
  assert.equal(O.price([{ price: 19800, qty: 1 }], { coupon: c, now }).coupon, 0);
  assert.equal(O.price([{ price: 19800, qty: 3 }], { coupon: c, now: now + 2 * 36e5 }).coupon, 0);
});

test('쿠폰은 28시간 뒤 정시까지 쓰고, 남은 시간을 초 단위로 알려 줘요', () => {
  const now = at('2026-11-04T10:30');
  const c = O.coupons.issue(now);
  assert.equal(c.expiresAt, at('2026-11-05T15:00'));
  assert.equal(O.couponEnds(c), '11월 5일(목) 오후 3시까지');
  assert.equal(O.couponLeft(c, c.expiresAt - (3 * 3600 + 2 * 60 + 5) * 1000).label, '3시간 02분 05초 남았어요');
  assert.equal(O.couponEnds({ expiresAt: at('2026-11-08T00:00') }), '11월 7일(토) 밤 12시까지');
});

test('회원가입: 아무것도 안 적어도 가입되고 쿠폰을 받아요', () => {
  const r = O.member.join({});
  assert.equal(r.member.name, '고객');
  assert.equal(r.coupon.amount, 10000);
});

const good = { type: 'sub', weeks: 4, lines: [{ id: 'pink', name: '분홍이', price: 19800, qty: 1 }], name: '장민욱', phone: '010-1234-5678',
  zip: '04524', addr1: '서울특별시 중구 세종대로 110', addr2: '1층', mode: 'dawn', gate: 'free', pay: 'card', issuer: '신한', agree: true };

test('주문서 검증', () => {
  assert.equal(O.validate(good).ok, true);
  const bad = O.validate({ mode: 'dawn', zip: '63122', pay: 'card' });
  for (const k of ['lines', 'name', 'phone', 'addr1', 'addr2', 'mode', 'issuer', 'agree']) assert.ok(bad.errors[k], k);
});

test('주문 생성: 정기배송이면 다음 배송 일정까지 돌려줘요', async () => {
  const o = await O.create(good, { now: at('2026-11-04T10:00'), latency: 0 });
  assert.match(o.id, /^DA20261104-\d{4}$/);
  assert.equal(o.status, 'ACTIVE');
  assert.equal(o.delivery.arriveDate, '2026-11-06');
  assert.equal(o.next.length, 3);
  assert.equal(o.shipTo.phone, '010-****-5678');
  await assert.rejects(O.create({ ...good, phone: '12' }, { latency: 0 }), e => !!e.errors.phone);
});
