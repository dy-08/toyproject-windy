let content = document.getElementById('content');
let link = document.querySelectorAll('#pages a');
link.forEach((item) => {
  item.addEventListener('click', () => {
    let page = `/src/html/${item.getAttribute('data-page')}`;
    fetch(page)
      .then((response) => response.text())
      .then((data) => (content.innerHTML = data))
      .catch((e) => console.log(e));
  });
});
