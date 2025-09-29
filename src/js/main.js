import { fetchWeatherCurrent } from './weather.js';
import { fetchWeatherRange } from './forecast.js';
import { ads } from './promotions.js';
import { virtualAssistant } from './character.js';

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
    let name = item.getAttribute('data-page'); // weather.html
    console.log(name);

    try {
        const res = await fetch(path);
        const data = await res.text();
        content.innerHTML = data;

        // 기존 동적 스크립트 제거
        document.querySelectorAll('script[data-dynamic]').forEach((s) => s.remove());

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
        // console.log('page:', page.slice(0, -5)); // page: weather, ...

        if (page === 'weather.html') {
            fetchWeatherCurrent({ location: '안산', x: 57, y: 121 });
            virtualAssistant(page.slice(0, -5));
        }
        if (page === 'forecast.html') {
            fetchWeatherRange();
            virtualAssistant(page.slice(0, -5));
        }
        if (page === 'promotions.html') {
            await ads(15);
            virtualAssistant(page.slice(0, -5));
        }
        if (page === 'guide.html') {
            virtualAssistant(page.slice(0, -5));
        }
    });
});

// QR 버튼 이벤트 처리
// onclick 사용불가 -> script type이 module이라 이벤트리스너 직접 등록해야됨
document.querySelectorAll('.content-btns-innerWrap > button').forEach((btn) =>
    btn.addEventListener('click', () => {
        const img = document.getElementById('qr');
        const bg = document.querySelector('.bg-qr');
        const qr = document.querySelector('.content-qr');
        const body = document.querySelector('body');
        switch (btn.id) {
            case 'btn-appstore':
            case 'btn-googleplay':
                const src =
                    btn.id === 'btn-appstore'
                        ? './src/assets/images/applestore_qr.jpeg'
                        : './src/assets/images/playstore_qr.jpeg';
                img.src = src;
                bg.classList.add('on');
                qr.classList.add('on');
                body.style.overflow = 'hidden';
                break;
            case 'btn-huawei':
                return window.open('https://appgallery.huawei.com/app/C110281657', '_blank');
        }
    })
);
// this는 화살표함수에서 작동 ❌
// 2가지해결책: event.currentTarget 사용하거나 화살표함수 -> function키워드사용
// 화살표 함수(=>) 안에서는 this가 현재 요소를 가리키지 않기 때문
// 화살표 함수는 자신만의 this를 가지지 않고, 상위 스코프의 this를 그대로 가져오기 때문에 this.style은 undefined가 됨
document.querySelector('.bg-qr').addEventListener('click', function () {
    document.querySelector('.content-qr').classList.remove('on');
    this.classList.remove('on');
    body.style.overflow = 'visible';
});

// 캐릭터 스크롤 이벤트
let characterEvent = () => {
    const assistantCharacter = document.getElementById('assistant-character');
    assistantCharacter.classList.add('appeared');
    virtualAssistant('index');
};
document.addEventListener('DOMContentLoaded', characterEvent);

characterEvent();
// 검색기능
const searchButton = document.getElementById('icon-search');
searchButton.addEventListener('click', async () => {
    const searchTarget = document.querySelector('.input-search').value.trim();
    if (!searchTarget) return;
    const data = await getLocationData();
    const [target] = data.filter((item) => item.location === searchTarget);
    console.log(target);
    if (target) {
        const a = document.getElementById('weather');
        console.log(target);

        let targetLocation = {
            location: target.location,
            x: target.x,
            y: target.y,
        };
        changePages(a);
        await fetchWeatherCurrent(targetLocation);
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
