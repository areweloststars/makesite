/* =========================================================
   [수정] 상품 정보 — 2026년 10월 원본 자사몰 화면 기준
   - 가격이나 이름을 여기서 바꾸면 카드가 전부 함께 바뀌어요.
   - 실제 사진을 쓰려면 images 폴더에 "id.jpg"(예: pink.jpg)를 넣으세요.
   - [확인 필요] 노랑이=라인방패, 까망이=버닝방패는 세트 배너를 보고 추정한 짝이에요.
   ========================================================= */
const PRODUCTS = {
  pink:   { tone: 'pink',   short: '분홍이',   nick: '분홍이', line: '당당방패', name: '슈가컷팅 레시피',      sub: '슈가컷팅 레시피',     price: 19800, was: 32000,  flags: ['BEST'],   tags: ['약국 입점'],            when: '단 게 자꾸 당길 때', page: 'product.html' },
  yellow: { tone: 'yellow', short: '노랑이',   nick: '노랑이', line: '라인방패', name: '호박녹차 붓기레시피', sub: '호박녹차 붓기레시피', price: 19800, was: 32000,  flags: ['BEST'],   tags: [],                       when: '아침 붓기가 신경 쓰일 때' },
  black:  { tone: 'black',  short: '까망이',   nick: '까망이', line: '버닝방패', name: '블랙버닝 레시피',      sub: '블랙버닝 레시피',     price: 19800, was: 32000,  flags: ['BEST'],   tags: [],                       when: '식단 관리 중일 때' },
  moon:   { tone: 'moon',   short: '달빛숙솜', name: '달빛숙솜 꿀잠 레시피',     sub: '꿀잠 레시피',          price: 19800, was: 32000,  flags: ['신제품'], tags: ['GABA', '국산 원물'],    when: '자기 전 한 잔' },
  lemon:  { tone: 'lemon',  short: '레몬디톡스', name: '무당 레몬디톡스 레시피',   sub: '무당 레시피',          price: 19800, was: 32000,  flags: [],         tags: ['HOT'],                  when: '상큼한 한 잔이 필요할 때' },
  pet:    { tone: 'pet',    short: '방패차',   shape: 'bottle', name: '당당한 방패차 PET', sub: '',           price: 13800, was: 16250,  flags: ['신제품'], tags: ['식후 혈당 기능성'], when: '밖에서 바로 마실 때' },
  shake:  { tone: 'shake',  short: '방패쉐이크', name: '방패쉐이크 인절미 초코 크런치', sub: '인절미 초코 크런치', price: 23800, was: null, flags: [], tags: ['선착순 100원딜', '고단백 26g'], when: '한 끼를 가볍게' },
  set3:   { tones: ['yellow', 'pink', 'black'], name: '방패차 3종 우리가족 건강세트', price: 50200, was: 96000, flags: ['BEST'], tags: [], when: '분홍이·노랑이·까망이를 한 번에' },
  set5:   { tones: ['lemon', 'yellow', 'pink', 'black', 'moon'], name: '방패차 5종 세트', price: 79800, was: 160000, flags: [], tags: ['선물 추천'], when: '슈가컷팅·레몬디톡스·호박녹차·블랙버닝·달빛숙솜' },
};

/* [수정] 고민 퀴즈 — 버튼 문구, 추천 상품, 추천 시간(time), 같이 마시면 좋은 차(pair) */
const CONCERNS = [
  { id: 'sugar', label: '단 게 자꾸 당겨요',            pick: 'pink',   time: 'pm',    pair: 'moon',   why: '점심 뒤 오후 근무를 시작하기 전, 단 디저트 대신 한 잔. 바나바잎·돼지감자·여주·수국잎을 담은 레시피예요.' },
  { id: 'swell', label: '아침 붓기가 신경 쓰여요',       pick: 'yellow', time: 'am',    pair: 'pink',   why: '호박과 녹차로 만든 고소한 레시피예요. 아침 근무 전 한 잔으로 하루를 시작해 보세요.' },
  { id: 'diet',  label: '식단 관리 중이에요',            pick: 'black',  time: 'pm',    pair: 'shake',  why: '식단을 관리하는 날, 오후 근무 전 루틴에 넣기 좋은 블랙버닝 레시피예요.' },
  { id: 'sleep', label: '잠들기가 어려워요',             pick: 'moon',   time: 'night', pair: 'yellow', why: '하루를 마무리하는 잠들기 전 한 잔. GABA를 담은 신제품 꿀잠 레시피예요.' },
  { id: 'fresh', label: '상큼하게 기분 전환하고 싶어요', pick: 'lemon',  time: 'pm',    pair: 'set3',   why: '설탕을 넣지 않은 상큼한 레몬 레시피예요. 오후 근무 전 가볍게 마시기 좋아요.' },
];

/* [수정] 퀴즈 2단계 — 마실 때 (브랜드 방향: 아침 근무 전 · 오후 근무 전 · 잠들기 전) */
const TIMES = [
  { id: 'am',    label: '아침 근무 전' },
  { id: 'pm',    label: '오후 근무 전' },
  { id: 'night', label: '잠들기 전' },
];

/* [수정] 후기 영상 자리 — 실제 고객 영상을 받으면 제목을 바꾸세요 */
const REELS = [
  { tone: 'yellow', title: '아침 근무 전 한 잔',        when: '노랑이 · 출근 직후' },
  { tone: 'pink',   title: '오후 근무 전, 디저트 대신', when: '분홍이 · 점심 뒤' },
  { tone: 'moon',   title: '잠들기 전 마지막 한 잔',    when: '달빛숙솜 · 밤' },
  { tone: 'black',  title: '책상 위 오후 루틴',         when: '까망이 · 오후' },
];

/* [수정] 하루 루틴 — 마실 때, 차, 효과와 근거 (사용자 결정 2026-10-31: 효과 문장 + 근거 링크만)
   식약처 인정 기능성은 인정 문구 그대로('~에 도움을 줄 수 있어요') 써요. */
const ROUTINE = [
  { time: '아침 근무 전', pick: 'yellow', line: '회사에 도착해 일을 시작하기 전',
    effects: [
      '카페인과 L-테아닌을 함께 먹으면 일을 바꿔 가며 할 때 더 정확해지고 머리가 또렷해져요 (카페인 40mg·L-테아닌 97mg).',
      'L-테아닌은 스트레스로 인한 긴장 완화에 도움을 줄 수 있어요 (식약처 인정 기능성).',
    ],
    srcs: [
      { s: 'Giesbrecht 외, 2010', u: 'https://www.researchgate.net/publication/47643925_The_combination_of_L-theanine_and_caffeine_improves_cognitive_performance_and_increases_subjective_alertness' },
      { s: '하이닥 · L-테아닌', u: 'https://news.hidoc.co.kr/news/articleView.html?idxno=26234' },
    ] },
  { time: '오후 근무 전', pick: 'pink', line: '점심을 먹고 자리로 돌아와',
    effects: [
      '바나바잎 추출물과 여주는 식후 혈당 상승 억제에 도움을 줄 수 있어요 (식약처 인정 기능성).',
      '돼지감자의 이눌린은 배변 활동 원활에 도움을 줄 수 있어요 (식약처 인정 기능성).',
    ],
    srcs: [
      { s: '약사공론 · 바나바잎 추출물', u: 'https://www.kpanews.co.kr/news/articleView.html?idxno=536999' },
      { s: '팜뉴스 · 미숙여주주정추출분말', u: 'https://www.pharmnews.com/news/articleView.html?idxno=102247' },
      { s: '식약처 · 이눌린/치커리추출물', u: 'https://www.khff.or.kr/assets/extra/hfood/01.pdf' },
    ] },
  { time: '잠들기 전', pick: 'moon', line: '하루를 마무리하며',
    effects: [
      'GABA를 하루 300mg씩 4주 먹으면 잠드는 데 걸리는 시간이 줄어요 (불면 증상이 있는 성인).',
    ],
    srcs: [
      { s: 'Byun 외, 2018', u: 'https://www.thejcn.com/pdf/10.3988/jcn.2018.14.3.291' },
    ] },
];

/* [수정] 제품 그림 색: body 파우치 몸통, ink 파우치에 인쇄된 글자 */
const TONES = {
  pink:   { body: '#e3a1ae', ink: '#5a1a2e' },
  yellow: { body: '#e6b04a', ink: '#432c06' },
  black:  { body: '#2b2320', ink: '#eadfcf' },
  moon:   { body: '#54489a', ink: '#eeeaff' },
  lemon:  { body: '#e0ce62', ink: '#443c0a' },
  pet:    { body: '#eba8b4', ink: '#5a1a2e' },
  shake:  { body: '#9cbfe2', ink: '#14365a' },
};

/* ===== 여기부터는 화면을 그리는 공통 코드예요 (mockup.html, product.html) ===== */
const CREST_PATHS = '<path d="M20 2 36 8v14c0 11-8 19-16 22C12 41 4 33 4 22V8z"/><path d="M20 13c3 3 3 8 0 11-3-3-3-8 0-11z"/><path d="M13 20c4-1 6 1 7 4-4 1-6-1-7-4z"/><path d="M27 20c-4-1-6 1-7 4 4 1 6-1 7-4z"/>';
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>';
const ARROW = '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';

const $ = id => document.getElementById(id);
const won = n => n.toLocaleString('ko-KR') + '원';
const off = p => (p.was ? Math.round((1 - p.price / p.was) * 100) : 0);

/* 두 색을 t 비율로 섞어요 (그림자·하이라이트 계산용) */
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = s => Math.round(((pa >> s) & 255) + ((((pb >> s) & 255) - ((pa >> s) & 255)) * t));
  return '#' + ((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1);
}

let uid = 0;
const POUCH = 'M34 10Q34 4 40 4H200Q206 4 206 10L214 288Q214 300 202 300H38Q26 300 26 288Z';

/* 스탠드 파우치: 몸통 음영, 윗부분 실링, 지퍼, 바닥 접힘, 반사광, 인쇄된 라벨 */
function pouchSVG(tone, title, sub) {
  const T = TONES[tone], id = 'pk' + (++uid);
  const hi = mix(T.body, '#ffffff', .32), lo = mix(T.body, '#000000', .18), lo2 = mix(T.body, '#000000', .32);
  const fs = Math.min(34, Math.floor(148 / Math.max(title.length, 3)));
  return `<svg class="pk" viewBox="0 0 240 304" aria-hidden="true">
  <defs>
    <linearGradient id="${id}x" x1="0" x2="1"><stop offset="0" stop-color="${lo2}"/><stop offset=".08" stop-color="${lo}"/><stop offset=".25" stop-color="${hi}"/><stop offset=".42" stop-color="${T.body}"/><stop offset=".8" stop-color="${T.body}"/><stop offset=".94" stop-color="${lo}"/><stop offset="1" stop-color="${lo2}"/></linearGradient>
    <linearGradient id="${id}y" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".24"/><stop offset=".15" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    <linearGradient id="${id}h" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="${id}c"><path d="${POUCH}"/></clipPath>
  </defs>
  <g clip-path="url(#${id}c)">
    <rect width="240" height="304" fill="url(#${id}x)"/>
    <rect width="240" height="304" fill="url(#${id}y)"/>
    <rect width="240" height="30" fill="#000" opacity=".07"/>
    <path d="M26 30H214" stroke="#000" stroke-opacity=".16"/>
    <path d="M26 42H214" stroke="#000" stroke-opacity=".2" stroke-width="2.2"/>
    <path d="M26 45.5H214" stroke="#fff" stroke-opacity=".3"/>
    <rect x="50" y="8" width="22" height="288" fill="url(#${id}h)" opacity=".7"/>
    <path d="M192 56Q202 160 190 268" stroke="#000" stroke-opacity=".06" stroke-width="9" fill="none"/>
    <path d="M18 262Q120 284 222 262L226 304H14Z" fill="#000" opacity=".1"/>
    <path d="M22 262Q120 284 218 262" stroke="#fff" stroke-opacity=".28" fill="none"/>
  </g>
  <path d="${POUCH}" fill="none" stroke="#000" stroke-opacity=".14"/>
  <g fill="${T.ink}" text-anchor="middle">
    <rect x="58" y="62" width="124" height="184" rx="3" fill="none" stroke="${T.ink}" stroke-opacity=".3"/>
    <text x="120" y="88" font-family="'Instrument Serif', serif" font-style="italic" font-size="18">Dr.Adam</text>
    <g transform="translate(109 98) scale(.55)" fill="none" stroke="${T.ink}" stroke-width="2.4" stroke-linejoin="round">${CREST_PATHS}</g>
    <text x="120" y="166" font-family="'Noto Serif KR', serif" font-weight="600" font-size="${fs}" letter-spacing="-1">${title}</text>
    ${sub ? `<text x="120" y="190" font-family="'Pretendard Variable', sans-serif" font-size="10.5" font-weight="600" opacity=".88">${sub}</text>` : ''}
    <path d="M102 207H138" stroke="${T.ink}" stroke-opacity=".45"/>
    <text x="120" y="225" font-family="'Pretendard Variable', sans-serif" font-size="7" font-weight="700" letter-spacing="2.4" opacity=".85">BANGPAE TEA</text>
    <text x="120" y="236" font-family="'Pretendard Variable', sans-serif" font-size="6.4" letter-spacing="1.6" opacity=".7">HERBAL INFUSION</text>
  </g>
</svg>`;
}

/* PET 병: 뚜껑, 찻빛 음료, 유리 반사광, 라벨 */
function bottleSVG(tone) {
  const T = TONES[tone], id = 'bt' + (++uid);
  const shape = 'M46 40H74V54Q74 62 82 70Q98 86 98 110V292Q98 306 84 306H36Q22 306 22 292V110Q22 86 38 70Q46 62 46 54Z';
  return `<svg class="pk pk-bottle" viewBox="0 0 120 312" aria-hidden="true">
  <defs>
    <linearGradient id="${id}t" x2="0" y2="1"><stop offset="0" stop-color="#d79a52"/><stop offset="1" stop-color="#9a5f26"/></linearGradient>
    <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".2" stop-color="#fff" stop-opacity=".35"/><stop offset=".32" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <clipPath id="${id}c"><path d="${shape}"/></clipPath>
  </defs>
  <g clip-path="url(#${id}c)">
    <rect width="120" height="312" fill="#f3e6d6" opacity=".55"/>
    <rect y="96" width="120" height="216" fill="url(#${id}t)"/>
    <rect y="140" width="120" height="104" fill="${T.body}"/>
    <rect width="120" height="312" fill="url(#${id}g)"/>
  </g>
  <path d="${shape}" fill="none" stroke="#000" stroke-opacity=".16"/>
  <rect x="42" y="8" width="36" height="34" rx="5" fill="${mix(T.body, '#000000', .45)}"/>
  <path d="M46 14V38M52 14V38M58 14V38M64 14V38M70 14V38M74 14V38" stroke="#fff" stroke-opacity=".14"/>
  <g fill="${T.ink}" text-anchor="middle">
    <text x="60" y="166" font-family="'Instrument Serif', serif" font-style="italic" font-size="12">Dr.Adam</text>
    <text x="60" y="194" font-family="'Noto Serif KR', serif" font-weight="600" font-size="16" letter-spacing="-.5">방패차</text>
    <text x="60" y="210" font-family="'Pretendard Variable', sans-serif" font-size="6.5" font-weight="700" letter-spacing="1.6">BANGPAE TEA</text>
    <text x="60" y="228" font-family="'Pretendard Variable', sans-serif" font-size="7" font-weight="600" opacity=".85">500ml PET</text>
  </g>
</svg>`;
}

/* 상품 하나의 그림 (세트는 파우치 여러 개) */
function packshot(id) {
  const p = PRODUCTS[id];
  if (p.tones) return `<div class="pk-row">${p.tones.map(t => pouchSVG(t, PRODUCTS[Object.keys(PRODUCTS).find(k => PRODUCTS[k].tone === t)].short, '')).join('')}</div>`;
  if (p.shape === 'bottle') return bottleSVG(p.tone);
  return pouchSVG(p.tone, p.short, p.sub);
}

/* 찻잔: 받침, 찻빛, 김 */
const CUP = `<svg class="cup" viewBox="0 0 220 176" aria-hidden="true">
  <defs>
    <linearGradient id="cupb" x1="0" x2="1"><stop offset="0" stop-color="#d9cfc1"/><stop offset=".3" stop-color="#fbf8f2"/><stop offset=".7" stop-color="#efe8dc"/><stop offset="1" stop-color="#cfc3b2"/></linearGradient>
    <radialGradient id="cupt" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#d49a55"/><stop offset=".7" stop-color="#a8692c"/><stop offset="1" stop-color="#7f4c1d"/></radialGradient>
  </defs>
  <ellipse cx="110" cy="160" rx="96" ry="12" fill="#000" opacity=".12"/>
  <ellipse cx="110" cy="150" rx="92" ry="17" fill="#f4efe6" stroke="#d6cbbb"/>
  <ellipse cx="110" cy="148" rx="60" ry="9" fill="#000" opacity=".06"/>
  <path d="M178 82Q208 80 206 104Q204 126 170 122" fill="none" stroke="#e6ddd0" stroke-width="10" stroke-linecap="round"/>
  <path d="M40 66Q42 140 110 144Q178 140 180 66Z" fill="url(#cupb)"/>
  <ellipse cx="110" cy="66" rx="70" ry="14" fill="#fbf8f2" stroke="#d6cbbb"/>
  <ellipse cx="110" cy="68" rx="62" ry="10.5" fill="url(#cupt)"/>
  <ellipse cx="92" cy="65" rx="20" ry="3" fill="#fff" opacity=".35"/>
  <g class="steam" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" opacity=".85">
    <path d="M94 50C86 38 102 30 94 16"/><path d="M114 48C106 34 124 26 114 8"/><path d="M134 50C128 40 140 32 134 20"/>
  </g>
</svg>`;

/* 잎 하나: 길이 l, 너비 w (원점에서 위로 자라요) */
function leafPath(l, w) {
  return `M0 0C${w * .62} ${-l * .22} ${w * .58} ${-l * .74} 0 ${-l}C${-w * .58} ${-l * .74} ${-w * .62} ${-l * .22} 0 0Z`;
}
function leaf(x, y, l, w, deg, cls = '') {
  return `<g transform="translate(${x} ${y}) rotate(${deg})"${cls ? ` class="${cls}"` : ''}><path d="${leafPath(l, w)}"/><path class="vein" d="M0 -2V${-l * .94}"/></g>`;
}

/* 바나바잎 가지 (히어로 장식) */
const SPRIG = `<svg class="sprig" viewBox="0 0 180 120" aria-hidden="true">
  <defs><linearGradient id="lf" x1="0" x2="1"><stop offset="0" stop-color="#5f7a4c"/><stop offset="1" stop-color="#8aa572"/></linearGradient></defs>
  <path d="M8 104C56 92 104 70 168 22" fill="none" stroke="#6b5a3e" stroke-width="2.4" stroke-linecap="round"/>
  <g fill="url(#lf)" stroke="#4f6a3e" stroke-width=".8">
    ${leaf(46, 92, 46, 22, -40)}${leaf(70, 82, 50, 24, 62)}${leaf(102, 66, 52, 25, -28)}${leaf(128, 50, 48, 23, 70)}${leaf(156, 32, 40, 20, -10)}
  </g>
  <style>.sprig .vein{stroke:#dfe8d2;stroke-opacity:.7;fill:none}</style>
</svg>`;

/* 톱니 가장자리 잎 (수국잎) */
function serratedLeaf(l, w, teeth) {
  const pts = [];
  for (let i = 0; i <= teeth; i++) {
    const t = i / teeth, y = -l * t, half = Math.sin(Math.PI * Math.pow(t, .8)) * w / 2;
    const bump = i % 2 ? 0 : 5 * Math.sin(Math.PI * t);
    pts.push([half + bump, y]);
  }
  const right = pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L');
  const left = pts.slice().reverse().map(([x, y]) => `${(-x).toFixed(1)} ${y.toFixed(1)}`).join('L');
  return `M0 0L${right}L${left}Z`;
}

/* 원물 네 가지 선화 */
const BOTANICALS = {
  banaba: `<svg viewBox="0 0 200 200" aria-hidden="true"><path class="stem" d="M36 176C80 140 118 100 168 28"/>
    ${leaf(66, 150, 58, 30, -48, 'lf')}${leaf(92, 124, 62, 32, 56, 'lf')}${leaf(118, 92, 60, 30, -36, 'lf')}${leaf(140, 66, 52, 27, 64, 'lf')}${leaf(164, 34, 42, 22, 4, 'lf')}</svg>`,
  tuber: `<svg viewBox="0 0 200 200" aria-hidden="true">
    <path class="body" d="M44 122C30 92 58 70 82 80C92 58 124 56 134 76C156 70 178 92 166 116C182 134 164 162 136 156C122 174 88 172 78 156C52 164 30 148 44 122Z"/>
    <path class="line" d="M66 104q6 -6 12 0M104 92q6 -6 12 0M138 110q6 -6 12 0M96 134q6 -6 12 0M70 140q5 -5 10 0M126 138q5 -5 10 0"/>
    <path class="stem" d="M106 74C104 56 112 42 124 34"/>${leaf(124, 34, 30, 14, 50, 'lf')}</svg>`,
  melon: `<svg viewBox="0 0 200 200" aria-hidden="true">
    <path class="body" d="M34 160C40 104 92 50 150 34C170 30 178 46 166 62C136 112 94 154 48 172C36 176 30 170 34 160Z"/>
    <path class="line" d="M46 160C70 120 110 80 156 46M58 166C88 132 124 98 162 60M42 146C60 110 96 74 140 44"/>
    <g class="dots">${Array.from({ length: 14 }, (_, i) => { const t = (i + 1) / 15; return `<circle cx="${(40 + 120 * t).toFixed(0)}" cy="${(160 - 118 * t + (i % 2 ? 8 : -6)).toFixed(0)}" r="2.6"/>`; }).join('')}</g>
    <path class="stem" d="M160 40C170 26 182 22 190 24"/></svg>`,
  hydrangea: `<svg viewBox="0 0 200 200" aria-hidden="true"><g transform="translate(100 184) rotate(-14)">
    <path class="body" d="${serratedLeaf(160, 96, 22)}"/>
    <path class="line" d="M0 -4V-150M0 -40L-30 -66M0 -40L30 -66M0 -78L-32 -102M0 -78L32 -102M0 -112L-22 -130M0 -112L22 -130"/></g>
    <path class="stem" d="M100 184L94 198"/></svg>`,
};

/* 사진이 있으면 그림 위에 덮어요 */
function photo(id) {
  const p = PRODUCTS[id];
  return `<img src="images/${id}.jpg" alt="${p.nick ? p.nick + ' ' : ''}${p.name}" loading="lazy" onerror="this.remove()">`;
}

/* 촬영 스튜디오처럼 색 배경 위에 상품을 세워요 */
function stage(id, opts = {}) {
  const p = PRODUCTS[id];
  const tone = p.tone || p.tones[1] || p.tones[0];
  const flags = opts.plain ? '' : p.flags.map(f => `<span class="flag${f === 'BEST' ? ' best' : ''}">${f}</span>`).join('');
  return `<div class="stage${p.tones ? ' is-set' : ''}" data-tone="${tone}">
    ${packshot(id)}
    ${photo(id)}
    ${flags ? `<div class="flags">${flags}</div>` : ''}
  </div>`;
}

function names(p) {
  return p.nick ? `<p class="pline"><span class="dot" data-tone="${p.tone}"></span>${p.nick} · ${p.line}</p>` : `<p class="pline"><span class="dot" data-tone="${p.tone || 'pink'}"></span>${p.tags[0] || 'SET'}</p>`;
}

/* 상세 시안이 있는 상품은 이름을 링크로 */
function nameLink(p) {
  return p.page ? `<a class="pname-link" href="${p.page}">${p.name}</a>` : p.name;
}

function priceLine(p) {
  const pct = off(p);
  return `<p class="price">${pct ? `<em>${pct}%</em>` : ''}<b>${won(p.price)}</b>${p.was ? `<s>${won(p.was)}</s>` : ''}</p>`;
}

/* 상품 카드: 스튜디오 그림 + 번호 + 이름 + 가격 + 담기 */
function card(id, i) {
  const p = PRODUCTS[id];
  return `<article class="pcard">
    ${stage(id)}
    <div class="pmeta">
      <div class="ptop">${names(p)}${i ? `<span class="no">N°${String(i).padStart(2, '0')}</span>` : ''}</div>
      <h3 class="pname">${nameLink(p)}</h3>
      <p class="when">${p.when}</p>
      <div class="pfoot">${priceLine(p)}<button type="button" class="add" data-add="${id}" aria-label="${p.name} 담기">담기 +</button></div>
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
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
}

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

/* 스크롤하면 부드럽게 나타나기 (움직임 줄이기 설정이면 바로 보여요) */
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window);
const io = calm ? null : new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { rootMargin: '0px 0px -6% 0px' });
function reveal() {
  document.querySelectorAll('[data-reveal]:not(.in)').forEach(el => (io ? io.observe(el) : el.classList.add('in')));
}
if (!calm) document.documentElement.classList.add('motion');

/* =========================================================
   [수정] 장바구니 · 1분 회원가입 쿠폰 (order.js의 OrderAPI를 써요)
   - 담기 → 실제로 담겨요(이 브라우저에 저장). 장바구니에서 금액과 도착 예정일을 바로 보여 줘요
   - 쿠폰 받기 → 가입 창(아무거나 입력해도 가입) → 1만원 쿠폰. 남은 시간이 1초마다 줄어요
   ========================================================= */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const thumb = id => { const p = PRODUCTS[id]; return `<span class="thumb" aria-hidden="true" data-tone="${p.tone || p.tones[1]}">${packshot(id)}</span>`; };
const X_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
const OA = window.OrderAPI;
if (OA) {
  document.body.insertAdjacentHTML('beforeend', `<dialog class="drawer" id="cart" aria-labelledby="cart-title"><div class="drawer-in" id="cart-in"></div></dialog>
<dialog class="join" id="join" aria-labelledby="join-title"><div class="join-in" id="join-in"></div></dialog>`);
  const cartDlg = $('cart'), joinDlg = $('join'), C = OA.POLICY.coupon;
  const routineTotal = ROUTINE.reduce((s, r) => s + PRODUCTS[r.pick].price, 0);
  const cartLines = () => OA.cart.get().filter(l => PRODUCTS[l.id]).map(l => ({ id: l.id, qty: l.qty, name: PRODUCTS[l.id].name, price: PRODUCTS[l.id].price }));
  const qtyBox = l => `<div class="qty" role="group" aria-label="${l.name} 수량"><button type="button" data-q="-1" aria-label="하나 빼기">−</button><span>${l.qty}</span><button type="button" data-q="1" aria-label="하나 더하기">+</button></div>`;

  function renderCart() {
    const ls = cartLines(), saved = OA.prefs.zip(), zip = OA.regionOf(saved) ? saved : '04524';
    const q = OA.quote({ zip, mode: 'parcel' }), c = OA.coupons.valid();
    const pr = OA.price(ls, { region: q.region, coupon: c });
    const head = `<div class="drawer-head"><h2 id="cart-title">장바구니 <span>${OA.cart.count()}</span></h2><button type="button" class="icon-btn" data-close aria-label="장바구니 닫기">${X_ICON}</button></div>`;
    if (!ls.length) { $('cart-in').innerHTML = head + '<p class="cart-empty">장바구니가 비어 있어요.</p><a class="btn line" href="mockup.html#lineup" data-close>방패차 보러 가기</a>'; return; }
    $('cart-in').innerHTML = `${head}
      <ul class="cart-lines">${ls.map(l => `<li data-id="${l.id}">${thumb(l.id)}<div><p class="nm">${PRODUCTS[l.id].nick ? PRODUCTS[l.id].nick + ' · ' : ''}${l.name}</p><p class="pr">${won(l.price * l.qty)}</p>${qtyBox(l)}</div></li>`).join('')}</ul>
      <div class="cart-eta"><p class="eta-main"><b>${q.text}</b></p>
        <p class="eta-sub">${q.region.sido} 기준 택배 · ${q.cutoffLabel} · <button type="button" class="linkish" data-zip>지역 바꾸기</button></p>
        <form class="zip-mini" id="zip-mini" hidden><label class="sr-only" for="zip-in">우편번호</label><input id="zip-in" inputmode="numeric" maxlength="5" placeholder="우편번호 5자리" autocomplete="postal-code"><button type="submit" class="btn sm">확인</button></form></div>
      <dl class="sum"><div><dt>상품 금액</dt><dd>${won(pr.subtotal)}</dd></div>${pr.coupon ? `<div class="minus"><dt>가입 쿠폰</dt><dd>−${won(pr.coupon)}</dd></div>` : ''}<div><dt>배송비</dt><dd>${pr.shipping ? won(pr.shipping) : '무료'}</dd></div><div class="tot"><dt>결제 예정 금액</dt><dd>${won(pr.total)}</dd></div></dl>
      ${pr.freeLeft ? `<p class="hint">${won(pr.freeLeft)} 더 담으면 무료배송이에요.</p>` : ''}
      ${c ? `<p class="cart-coupon">${pr.coupon ? '가입 쿠폰을 썼어요' : `${won(c.minOrder)} 이상 담으면 가입 쿠폰을 써요`} · <span data-coupon-left></span></p>`
          : `<button type="button" class="coupon-cta" data-join><b>${won(C.amount)} 가입 쿠폰 받기</b>${pr.subtotal >= C.minOrder ? ` · 쓰면 ${won(pr.total - C.amount)}` : ` · ${won(C.minOrder)} 이상 구매 시`}</button>`}
      <a class="btn" href="checkout.html">${won(pr.total)} 주문하기</a>
      <a class="tlink" href="checkout.html?type=sub">정기배송으로 받기 · 늘 무료배송</a>`;
  }

  function renderJoin() {
    const m = OA.member.get(), c = OA.coupons.valid();
    const head = t => `<div class="join-head"><h2 id="join-title">${t}</h2><button type="button" class="icon-btn" data-close aria-label="닫기">${X_ICON}</button></div>`;
    $('join-in').innerHTML = m && c ? `${head(`${esc(m.name)}님, 쿠폰이 도착했어요`)}
      <div class="coupon-card"><p class="cc-amt">${won(c.amount)}</p><p class="cc-name">${c.name}</p>
        <p class="cc-cond">${won(c.minOrder)} 이상 구매 시 · 정기배송 첫 결제에도 써요</p>
        <p class="cc-end">${OA.couponEnds(c)} 사용</p><p class="cc-left" data-coupon-left aria-live="off"></p></div>
      <a class="btn" href="checkout.html?type=sub&amp;items=yellow,pink,moon">쿠폰 쓰고 루틴 시작하기 · ${won(routineTotal - c.amount)}</a>
      <button type="button" class="btn line" data-close>계속 둘러보기</button>`
    : `${head(m ? '쿠폰 다시 받기' : '1분 회원가입')}
      <p class="join-lede">가입하면 <b>${won(C.amount)} 쿠폰</b>을 바로 드려요. 받은 때부터 ${C.hours}시간(${C.hours / 24}일) 안에 쓸 수 있어요.</p>
      <form class="join-form" id="join-form" novalidate>
        <div class="field"><label for="j-name">이름</label><input id="j-name" name="name" autocomplete="name" value="${m ? esc(m.name) : ''}"></div>
        <div class="field"><label for="j-contact">휴대폰 번호 또는 이메일</label><input id="j-contact" name="contact" autocomplete="email"></div>
        <label class="agree"><input type="checkbox" name="agree" checked> 이용약관과 개인정보 수집·이용에 동의해요</label>
        <button type="submit" class="btn">가입하고 쿠폰 받기</button>
        <p class="hint">시안이라 아무거나 입력해도(비워 둬도) 가입돼요. 입력한 내용은 이 브라우저에만 저장되고 어디에도 보내지 않아요.</p>
      </form>`;
  }

  function tick() {
    const c = OA.coupons.valid();
    document.querySelectorAll('[data-coupon-left]').forEach(el => { el.textContent = c ? OA.couponLeft(c).label : '쿠폰 기간이 끝났어요'; });
  }
  window.tickCoupon = tick;
  window.syncShop = function () {
    const n = OA.cart.count(), badge = $('cart-count'), c = OA.coupons.valid();
    if (badge) { badge.textContent = n; badge.hidden = !n; }
    document.querySelectorAll('[data-join]').forEach(el => {
      if (!el.dataset.label) el.dataset.label = el.innerHTML;
      el.innerHTML = !c ? el.dataset.label
        : el.closest('.announce') ? `내 ${won(c.amount)} 쿠폰 · <span data-coupon-left></span>`
        : el.classList.contains('text-link') ? '내 쿠폰' : '내 쿠폰 보기';
    });
    document.dispatchEvent(new CustomEvent('shop:change'));
    tick();
  };
  const open = (dlg, render) => { render(); if (!dlg.open) dlg.showModal(); tick(); };
  window.openCart = () => open(cartDlg, renderCart);
  window.openJoin = () => open(joinDlg, renderJoin);

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) { OA.cart.add(add.dataset.add); syncShop(); openCart(); return; }
    if (e.target.closest('[data-cart]')) { e.preventDefault(); openCart(); return; }
    if (e.target.closest('[data-join]')) { e.preventDefault(); if (cartDlg.open) cartDlg.close(); openJoin(); return; }
    const x = e.target.closest('[data-close]');
    if (x) x.closest('dialog').close();
  });
  [cartDlg, joinDlg].forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
  cartDlg.addEventListener('click', e => {
    const qb = e.target.closest('[data-q]');
    if (qb) {
      const id = qb.closest('li').dataset.id, l = OA.cart.get().find(x => x.id === id);
      OA.cart.set(id, (l ? l.qty : 0) + +qb.dataset.q);
      renderCart(); syncShop();
      (cartDlg.querySelector(`li[data-id="${id}"] [data-q="${qb.dataset.q}"]`) || cartDlg.querySelector('[data-close]')).focus();
      return;
    }
    if (e.target.closest('[data-zip]')) { const f = $('zip-mini'); f.hidden = !f.hidden; if (!f.hidden) $('zip-in').focus(); }
  });
  cartDlg.addEventListener('input', e => e.target.setCustomValidity && e.target.setCustomValidity(''));
  cartDlg.addEventListener('submit', e => {
    e.preventDefault();
    const inp = $('zip-in'), v = inp.value.trim();
    if (!OA.regionOf(v)) { inp.setCustomValidity('우편번호 5자리를 확인해 주세요.'); inp.reportValidity(); return; }
    OA.prefs.setZip(v); renderCart();
  });
  joinDlg.addEventListener('submit', e => {
    e.preventDefault();
    OA.member.join({ name: e.target.elements.name.value, contact: e.target.elements.contact.value });
    renderJoin(); syncShop();
    joinDlg.querySelector('.btn').focus();
  });
  let hadCoupon = !!OA.coupons.valid();
  setInterval(() => { const has = !!OA.coupons.valid(); if (has !== hadCoupon) { hadCoupon = has; syncShop(); } else tick(); }, 1000);
  addEventListener('storage', () => syncShop());
  syncShop();
  if (location.hash === '#join') openJoin();
}
