import { fetchWeatherData } from './weather-now.js';
import { ads } from './promotions.js';

let content = document.getElementById('content');
let link = document.querySelectorAll('#pages a');
// 모바일 메뉴 이벤트
const m_menu = document.getElementById('mobile-menu');
const m_bg = document.getElementById('mobile-bg');
const pages = document.getElementById('pages');
const m_logo = document.getElementById('mobile-bg-logo');
const body = document.querySelector('body');
const list = document.querySelectorAll('.pages');
let isClick = false;
m_menu.addEventListener('click', () => {
  if (!isClick) {
    document.querySelectorAll('section').forEach((item) => {
      item.addEventListener('click', () => {
        m_bg.style.width = '0';
        pages.style.left = '-100%';
        m_logo.style.opacity = 0;
        body.style.overflow = 'visible';
        isClick = false;
      });
    });
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
// 리스트 클릭 시 이벤트
list.forEach((item) => {
  item.addEventListener('click', () => {
    m_bg.style.width = '0';
    pages.style.left = '-100%';
    m_logo.style.opacity = 0;
    body.style.overflow = 'visible';
    isClick = false;
  });
});

// 페이지별 JS 실행
function connectScript(a) {
  const script = document.createElement('script');
  const page = a.slice(0, -5);
  script.src = `./src/js/${page}.js`;
  script.type = 'module';
  script.setAttribute('data-dynamic', 'true');
  document.body.appendChild(script);
}

// 페이지 변환
async function changePages(item) {
  let path = `./src/html/${item.getAttribute('data-page')}`;
  let name = item.getAttribute('data-page'); // weather-now.html

  try {
    const res = await fetch(path);
    const data = await res.text();
    content.innerHTML = data;

    // 기존 동적 스크립트 제거
    document
      .querySelectorAll('script[data-dynamic]')
      .forEach((s) => s.remove());

    // 새 스크립트 연결
    connectScript(name);
  } catch (e) {
    console.error('페이지 변환 실패:', e);
  }
}

// 링크 클릭 이벤트
link.forEach((item) => {
  item.addEventListener('click', async () => {
    const page = item.getAttribute('data-page');
    await changePages(item);
    console.log('page:', page); // page: weather-now.html, ...
    if (page === 'weather-now.html')
      fetchWeatherData({ location: '안산', x: 57, y: 121 });
    if (page === 'promotions.html') await ads(15);
  });
});

// QR 버튼 이벤트 처리 해야됨
// btn-appstore, btn-googleplay, btn-huawei
// function openQR(a) {

// }
document.getElementById('btn-huawei').addEventListener('click', () => {
  return (window.location.href =
    'https://appgallery.huawei.com/app/C110281657');
});

// 캐릭터 스크롤 이벤트
let characterEvent = () => {
  let wsy = window.scrollY;
  const character = document.getElementById('character');
  window.addEventListener('scroll', () => {
    if (wsy >= 0) {
      character.classList.add('appeared');
    }
  });
};

window.addEventListener('scroll', characterEvent);

// 검색기능
const searchButton = document.getElementById('icon-search');
searchButton.addEventListener('click', async () => {
  const searchTarget = document.querySelector('.input-search').value.trim();
  if (!searchTarget) return;
  const data = await getLocationData();
  const [target] = data.filter((item) => item.location === searchTarget);
  console.log(target);
  if (target) {
    const a = document.getElementById('weather-now');
    console.log(target);

    let targetLocation = {
      location: target.location,
      x: target.x,
      y: target.y,
    };
    changePages(a);
    await fetchWeatherData(targetLocation);
  }
});

async function getLocationData() {
  try {
    const res = await fetch('./src/public/location.json');
    const data = await res.json();
    const arr = [...data];
    return arr;
  } catch (e) {
    console.error(e);
  }
}
