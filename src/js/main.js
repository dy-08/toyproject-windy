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
        console.log(pageName);

        fetch(pagePath)
            .then((res) => res.text())
            .then((data) => {
                content.innerHTML = data;

                // 기존 동적 스크립트 제거
                document.querySelectorAll('script[data-dynamic]').forEach((s) => s.remove());
                connectScript(pageName);
            })
            .catch((e) => console.log(e));
    });
});
