/* =========================================================
   [수정] 상품 정보 — 2026년 10월 dreve.co.kr 화면 기준
   - 가격이나 이름을 여기서 바꾸면 카드가 전부 함께 바뀌어요.
   - 실제 사진을 쓰려면 images 폴더에 "id.jpg"(예: pink.jpg)를 넣으세요.
   - [확인 필요] 노랑이=라인방패, 까망이=버닝방패는 세트 배너를 보고 추정한 짝이에요.
   ========================================================= */
const PRODUCTS = {
  pink:   { tone: 'pink',   nick: '분홍이', line: '당당방패', name: '슈가컷팅 레시피',      sub: '슈가컷팅 레시피',     price: 19800, was: 32000,  flags: ['BEST'],   tags: ['약국 입점'],            when: '단 게 자꾸 당길 때' },
  yellow: { tone: 'yellow', nick: '노랑이', line: '라인방패', name: '호박녹차 붓기레시피', sub: '호박녹차 붓기레시피', price: 19800, was: 32000,  flags: ['BEST'],   tags: [],                       when: '아침 붓기가 신경 쓰일 때' },
  black:  { tone: 'black',  nick: '까망이', line: '버닝방패', name: '블랙버닝 레시피',      sub: '블랙버닝 레시피',     price: 19800, was: 32000,  flags: ['BEST'],   tags: [],                       when: '식단 관리 중일 때' },
  moon:   { tone: 'moon',   name: '달빛숙솜 꿀잠 레시피',     sub: '꿀잠 레시피',          price: 19800, was: 32000,  flags: ['신제품'], tags: ['GABA', '국산 원물'],    when: '자기 전 한 잔' },
  lemon:  { tone: 'lemon',  name: '무당 레몬디톡스 레시피',   sub: '레몬디톡스 레시피',    price: 19800, was: 32000,  flags: [],         tags: ['HOT'],                  when: '상큼한 한 잔이 필요할 때' },
  pet:    { tone: 'pet',    shape: 'bottle', name: '당당한 방패차 PET', sub: '',           price: 13800, was: 16250,  flags: ['신제품'], tags: ['식후 혈당 기능성'], when: '밖에서 바로 마실 때' },
  shake:  { tone: 'shake',  label: '방패쉐이크', name: '방패쉐이크 인절미 초코 크런치', sub: '인절미 초코 크런치', price: 23800, was: null, flags: [], tags: ['선착순 100원딜', '고단백 26g'], when: '한 끼를 가볍게' },
  set3:   { tones: ['pink', 'yellow', 'black'], name: '방패차 3종 우리가족 건강세트', price: 50200, was: 96000, flags: ['BEST'], tags: [], when: '분홍이·노랑이·까망이를 한 번에' },
  set5:   { tones: ['pink', 'lemon', 'yellow', 'black', 'moon'], name: '방패차 5종 세트', price: 79800, was: 160000, flags: [], tags: ['선물 추천'], when: '슈가컷팅·레몬디톡스·호박녹차·블랙버닝·달빛숙솜' },
};

/* [수정] 고민 퀴즈 — 버튼 문구와 추천 상품 */
const CONCERNS = [
  { id: 'sugar', label: '단 게 자꾸 당겨요',            pick: 'pink',   why: '식후 디저트 대신 한 잔. 바나바잎·돼지감자·여주·수국잎을 담은 당케어 레시피예요.' },
  { id: 'swell', label: '아침 붓기가 신경 쓰여요',       pick: 'yellow', why: '호박과 녹차로 만든 고소한 레시피예요. 출근 전 한 잔으로 하루를 시작해 보세요.' },
  { id: 'diet',  label: '식단 관리 중이에요',            pick: 'black',  why: '식단을 관리하는 날, 하루 루틴에 넣기 좋은 블랙버닝 레시피예요.' },
  { id: 'sleep', label: '잠들기가 어려워요',             pick: 'moon',   why: '하루를 마무리하는 자기 전 한 잔. GABA를 담은 신제품 꿀잠 레시피예요.' },
  { id: 'fresh', label: '상큼하게 기분 전환하고 싶어요', pick: 'lemon',  why: '설탕을 넣지 않은 상큼한 레몬 레시피예요. 오후에 가볍게 마시기 좋아요.' },
];

/* [수정] 후기 영상 자리 — 실제 고객 영상을 받으면 제목을 바꾸세요 */
const REELS = [
  { tone: 'pink',   title: '식후 디저트 대신 한 잔', when: '분홍이 · 점심 후' },
  { tone: 'yellow', title: '출근 전 붓기 루틴',     when: '노랑이 · 아침' },
  { tone: 'moon',   title: '자기 전 꿀잠 루틴',     when: '달빛숙솜 · 밤' },
  { tone: 'black',  title: '책상 위 한 잔',         when: '까망이 · 오후' },
];

/* [수정] 하루 루틴 — 시간대와 차 */
const ROUTINE = [
  { time: '아침',      pick: 'yellow', line: '출근 전, 붓기가 신경 쓰일 때' },
  { time: '점심 식후', pick: 'pink',   line: '디저트 대신 한 잔' },
  { time: '밤',        pick: 'moon',   line: '자기 전, 하루를 마무리하며' },
];

/* ===== 여기부터는 화면을 그리는 공통 코드예요 (mockup.html, product.html) ===== */
const CREST = '<svg viewBox="0 0 40 46" aria-hidden="true"><path d="M20 2 36 8v14c0 11-8 19-16 22C12 41 4 33 4 22V8z"/><path d="M20 13c3 3 3 8 0 11-3-3-3-8 0-11z"/><path d="M13 20c4-1 6 1 7 4-4 1-6-1-7-4z"/><path d="M27 20c-4-1-6 1-7 4 4 1 6-1 7-4z"/></svg>';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';

const $ = id => document.getElementById(id);
const won = n => n.toLocaleString('ko-KR') + '원';
const off = p => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);

function pouch(tone, sub, opts = {}) {
  const label = opts.label || '방패차';
  return `<div class="pouch${opts.bottle ? ' is-bottle' : ''}" data-tone="${tone}">
    <span class="pouch-crest">${CREST}</span>
    <span class="pouch-name${label.length > 3 ? ' tight' : ''}">${label}</span>
    ${sub ? `<span class="pouch-sub">${sub}</span>` : ''}
  </div>`;
}

function art(id) {
  const p = PRODUCTS[id];
  if (p.tones) return `<div class="pouch-row">${p.tones.map(t => pouch(t, '')).join('')}</div>`;
  return pouch(p.tone, p.sub, { bottle: p.shape === 'bottle', label: p.label });
}

function thumb(id, plain = false) {
  const p = PRODUCTS[id];
  const pct = off(p);
  const flags = plain ? '' : p.flags.map(f => `<span class="flag red">${f}</span>`).join('') + (pct ? `<span class="flag dark">${pct}%</span>` : '');
  return `<div class="thumb">
    ${art(id)}
    <img src="images/${id}.jpg" alt="${p.nick ? p.nick + ' ' : ''}${p.name}" loading="lazy" onerror="this.remove()">
    ${flags ? `<div class="flags">${flags}</div>` : ''}
  </div>`;
}

function names(p) {
  return p.nick ? `<p class="names"><span class="nick" data-tone="${p.tone}">${p.nick}</span><span class="line-name">${p.line}</span></p>` : '';
}

function priceLine(p) {
  return `<p class="price"><b>${won(p.price)}</b>${p.was ? `<s>${won(p.was)}</s>` : ''}</p>`;
}

function card(id) {
  const p = PRODUCTS[id];
  return `<article class="card">
    ${thumb(id)}
    <div class="card-body">
      ${names(p)}
      <h3 class="pname">${p.name}</h3>
      ${p.when ? `<p class="when">${p.when}</p>` : ''}
      ${priceLine(p)}
      ${p.tags.length ? `<p class="tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</p>` : ''}
    </div>
  </article>`;
}

/* 주소 옵션: ?notes 개선 포인트, ?c= 광고 랜딩 */
const params = new URLSearchParams(location.search);

/* 시안 안내 토스트 */
const toastEl = $('toast');
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 2400);
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-demo]');
  if (!el) return;
  e.preventDefault();
  toast(el.dataset.demo);
});

/* 모바일 메뉴 */
const menuBtn = $('menu-btn');
const nav = $('site-nav');
function setMenu(open) {
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  nav.classList.toggle('open', open);
}
menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });

/* 개선 포인트 보기 (주소 끝에 #notes 또는 ?notes를 붙여 열면 처음부터 켜져요) */
const notesBtn = $('notes-toggle');
function setNotes(on) {
  notesBtn.setAttribute('aria-pressed', String(on));
  notesBtn.textContent = on ? '개선 포인트 숨기기' : '개선 포인트 보기';
  document.body.classList.toggle('show-notes', on);
  document.querySelectorAll('.note, .notes-only').forEach(n => { n.hidden = !on; });
}
notesBtn.addEventListener('click', () => setNotes(notesBtn.getAttribute('aria-pressed') !== 'true'));
if (location.hash === '#notes' || params.has('notes')) setNotes(true);
