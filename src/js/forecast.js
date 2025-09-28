// 날씨데이터에 따른 아이콘 랜더링
function findWeatherIcons(value) {
  switch (value) {
    case '1':
      return 'sun.png';
    case '3':
      return 'cloudy.png';
    case '4':
      return 'wind.svg';
  }
}
// 드래그 슬라이드
function dragSlide(obj) {
  let isDown = false;
  let startX = 0,
    translateX = 0;

  obj.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.clientX;
  });
  window.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    let deltaX = e.clientX - startX;
    startX = e.clientX;
    translateX += deltaX;
    console.log(translateX);

    // 마지막 카드가 보이는 위치 계산
    const totalWidth = Array.from(obj.children).reduce(
      (sum, card) => sum + card.offsetWidth + 10,
      0
    ); // gap 포함
    const containerWidth = obj.parentElement.offsetWidth;
    const minTranslateX = containerWidth - totalWidth;
    if (translateX > 0) translateX = 0;
    if (translateX < minTranslateX) translateX = minTranslateX;

    obj.style.transform = `translateX(${translateX}px)`;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
  });
}

export async function fetchWeatherRange() {
  // dateKey 할당
  const now = new Date();
  const hour = now.getHours();
  let dateKey;
  if (hour >= 5) {
    dateKey = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}${String(now.getDate()).padStart(2, '0')}`;
  } else {
    dateKey = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}${String(now.getDate() - 1).padStart(2, '0')}`;
  }
  try {
    const res = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=9424b102fa31a2cdf077b43d93ffbbd26e040beb866f241236f5a5e7913ab3ea&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${dateKey}&base_time=0500&nx=57&ny=121`
    );
    const data = await res.json();
    const datas = data.response.body.items.item;
    /**
     * Pick: 오늘시간, TMP(1시간기온), SKY(하늘상태)
     **/
    const hourlyWeather = [];

    // 파싱 (기준: 1일 06:00~06:00, SKY, TMP, 시간은 두 배열 중 SKY 활용)
    // SKY
    const parsedDataSky = datas.filter(
      (item) => item.fcstDate === dateKey && item.category === 'SKY'
    );
    const nextDay = Number(dateKey) + 1;
    let parsedDataNextday = datas.filter(
      (item) => item.fcstDate === String(nextDay) && item.category === 'SKY'
    );
    let i = 0;
    while (i < 7) {
      parsedDataSky.push(parsedDataNextday[i]);
      i++;
    }
    // TEMP
    const parsedDataTemp = datas.filter(
      (item) => item.fcstDate === dateKey && item.category === 'TMP'
    );
    parsedDataNextday = [];
    parsedDataNextday = datas.filter(
      (item) => item.fcstDate === String(nextDay) && item.category === 'TMP'
    );
    i = 0;
    while (i < 7) {
      parsedDataTemp.push(parsedDataNextday[i]);
      i++;
    }
    parsedDataSky.forEach((item, idx) => {
      // 데이터합치기 성공✨
      hourlyWeather.push({
        date: item.fcstTime,
        weather: item.fcstValue,
        temp: parsedDataTemp[idx].fcstValue,
      });

      renderWeather(hourlyWeather);
    });
  } catch (e) {
    console.error('API 실패, fallback 데이터 사용', e);
    const mockHourlyWeather = [
      { date: '0600', weather: '4', temp: 21 },
      { date: '0700', weather: '3', temp: 22 },
      { date: '0800', weather: '3', temp: 22 },
      { date: '0900', weather: '3', temp: 22 },
      { date: '1000', weather: '3', temp: 22 },
      { date: '1100', weather: '3', temp: 22 },
      { date: '1200', weather: '1', temp: 22 },
      { date: '1300', weather: '1', temp: 22 },
      { date: '1400', weather: '1', temp: 22 },
      { date: '1500', weather: '1', temp: 23 },
      { date: '1600', weather: '3', temp: 23 },
      { date: '1700', weather: '3', temp: 22 },
      { date: '1800', weather: '3', temp: 22 },
      { date: '1900', weather: '3', temp: 22 },
      { date: '2000', weather: '3', temp: 21 },
      { date: '2100', weather: '3', temp: 21 },
      { date: '2200', weather: '3', temp: 21 },
      { date: '2300', weather: '3', temp: 21 },
      { date: '0000', weather: '4', temp: 21 },
      { date: '0100', weather: '4', temp: 20 },
      { date: '0200', weather: '4', temp: 20 },
      { date: '0300', weather: '4', temp: 20 },
      { date: '0400', weather: '4', temp: 20 },
      { date: '0500', weather: '3', temp: 20 },
      { date: '0600', weather: '4', temp: 20 },
    ];
    renderWeather(mockHourlyWeather);
  }
}

function renderWeather(hourlyData) {
  // 카드랜더링, 드래그슬라이드 전역변수 할당
  const forecastInnerBox = document.querySelector('.forecast-innerBox');
  forecastInnerBox.innerHTML = '';

  // 카드 랜더링
  hourlyData.forEach((item) => {
    const div = document.createElement('div');
    div.className = 'forecast-card';
    div.innerHTML = `
                  <div class="card-value-small">${item.date}</div>
                  <img src="./src/assets/images/${findWeatherIcons(
                    item.weather
                  )}" alt="" />
                  <div class="card-value-main">${item.temp}°</div>
              `;
    forecastInnerBox.appendChild(div);
  });
  dragSlide(forecastInnerBox);
}

fetchWeatherRange();
