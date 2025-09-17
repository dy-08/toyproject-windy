let content = document.getElementById('content');
let link = document.querySelectorAll('#pages a');
link.forEach((item) => {
  item.addEventListener('click', () => {
    let pagePath = `/src/html/${item.getAttribute('data-page')}`;
    let pageName = item.getAttribute('data-page'); // weather-now.html
    fetch(pagePath)
      .then((res) => res.text())
      .then((data) => {
        content.innerHTML = data;

        // 기존 동적 스크립트 제거
        document
          .querySelectorAll('script[data-dynamic]')
          .forEach((s) => s.remove());
        // 페이지별 JS 실행
        if (pageName === 'weather-now.html') {
          const script = document.createElement('script');
          script.src = './src/js/weather-now.js';
          script.setAttribute('data-dynamic', 'true');
          document.body.appendChild(script);
        }
      })
      .catch((e) => console.log(e));
  });
});
