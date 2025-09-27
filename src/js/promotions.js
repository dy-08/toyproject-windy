/**
 * 이 페이지는 웹툰 광고 이미지를 무한 롤링 배너로 보여줍니다.
 * 리스트를 두 세트 이어붙이고 CSS 애니메이션으로 절반만 이동시켜 끊김 없이 반복되도록 구현했습니다.
 */

export async function ads(n) {
  const ul = document.querySelector('.ads');
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
  ul.innerHTML += ul.innerHTML;
}
ads(15);
