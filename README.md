# makesite
make site with claude code

## dreve-portfolio

닥터이브(Dr.Eve) 자사몰 메인 페이지를 분석하고 다시 기획해 본 **비공식 포트폴리오**입니다. 실제 닥터이브(주식회사 퍼포즈드) 사이트가 아니며 주문·결제·회원가입은 동작하지 않습니다.

- `dreve-portfolio/index.html` — 분석·개선 제안 페이지 (먼저 여는 곳)
  - 퍼포즈드 회사 이해(매출·목표·연표·사업 구조·경쟁 지형), 문제 정의 P1~P6, 개선 전략, 개선안 ①~⑧, 검증 계획, 90일 실행 계획, 출처와 한계
- `dreve-portfolio/mockup.html` — 모바일 우선 메인 개선 시안
  - 개선 포인트: 맨 위 '개선 포인트 보기' 버튼, 또는 주소 끝에 `?notes` / `#notes`
  - 광고 랜딩: 주소 끝에 `?c=sugar`, `?c=swell`, `?c=diet`, `?c=sleep`, `?c=fresh`를 붙이면 그 고민의 추천 결과가 열린 채 시작
  - 주요 개선 ①~⑨: 사용 장면 히어로, 고민 퀴즈(2단계: 마실 때까지), 색 이름·기능 이름 함께 표기, 후기 숏폼 자리, 원물 소개, 모바일 하단 고정 버튼, 광고별 퀴즈 랜딩, 하루 루틴과 정기배송 자리
- `dreve-portfolio/product.html` — 분홍이 상품 상세 시안 (한 번 구매·루틴 정기배송)
- 부록: `ads.html` 숏폼 광고 기획 · `crm.html` 재구매 메시지 설계 · `copy.html` 표현 체크리스트 초안 · `summary.html` 지원서용 A4 한 장 요약(인쇄·PDF 저장)
- 디자인 레퍼런스: OLIPOP·Poppi(차마다 색 세계, 큰 제품, 굵은 글자), 오설록(여백). 시안은 `shop.css`·`shop.js`, 분석 페이지는 `case.css`
- `dreve-portfolio/images/` — 상품 사진을 넣으면 시안의 파우치 그림 대신 나와요 (넣는 법 안내 포함)
- 여는 법: `dreve-portfolio/index.html`을 브라우저로 열기
- 기획: 장민욱 / 구현: Claude Code 활용
- 상품명과 가격은 2026년 10월 dreve.co.kr 화면을, 회사 정보는 2026년 10월 공개 자료를 참고했습니다.
