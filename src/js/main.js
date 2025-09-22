let content = document.getElementById('content');
let link = document.querySelectorAll('#pages a');

// 페이지별 JS 실행
function connectScript(a) {
  const script = document.createElement('script');
  const page = a.slice(0, -5);
  script.src = `./src/js/${page}.js`;
  script.setAttribute('data-dynamic', 'true');
  document.body.appendChild(script);
}

link.forEach((item) => {
  item.addEventListener('click', () => {
    let pagePath = `./src/html/${item.getAttribute('data-page')}`;
    let pageName = item.getAttribute('data-page'); // weather-now.html

    fetch(pagePath)
      .then((res) => res.text())
      .then((data) => {
        content.innerHTML = data;

        // 기존 동적 스크립트 제거
        document
          .querySelectorAll('.script[data-dynamic]')
          .forEach((s) => s.remove());
        connectScript(pageName);
      })
      .catch((e) => console.log(e));
  });
});

// 모바일 메뉴 이벤트
const m_menu = document.getElementById('mobile-menu');
const m_bg = document.getElementById('mobile-bg');
const pages = document.getElementById('pages');
const m_logo = document.getElementById('mobile-bg-logo');
const body = document.querySelector('body');
let isClick = false;
m_menu.addEventListener('click', () => {
  if (!isClick) {
    m_bg.style.width = '80%';
    pages.style.left = '2.4rem';
    m_logo.style.opacity = 1;
    body.style.overflow = 'hidden';
    isClick = true;
  } else {
    m_bg.style.width = '0';
    pages.style.left = '-100%';
    m_logo.style.opacity = 0;
    body.style.overflow = 'visible';
    isClick = false;
  }
});
