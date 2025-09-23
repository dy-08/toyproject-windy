function ads(n) {
  let startValue = 1;
  while (startValue <= n) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = `./src/assets/images/webtoon_${String(startValue).padStart(
      2,
      0
    )}.jpg`;
    img.alt = '웹툰 광고이미지';
    img.className = 'imgs';
    li.appendChild(img);
    document.querySelector('.ads').appendChild(li);
    startValue++;
  }
}
ads(15);
