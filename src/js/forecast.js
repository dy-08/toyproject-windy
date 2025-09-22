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

try {
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
  fetch(
    `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=9424b102fa31a2cdf077b43d93ffbbd26e040beb866f241236f5a5e7913ab3ea&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${dateKey}&base_time=0500&nx=57&ny=121`
  )
    .then((res) => res.json())
    .then((data) => {
      const res = data.response.body.items.item;
      /**
       * Pick: 오늘시간, TMP(1시간기온), SKY(하늘상태)
       **/
      const hourlyWeatherToday = [];

      // 파싱 (기준: 1일 06:00~06:00, SKY, TMP, 시간은 두 배열 중 SKY 활용)
      // SKY
      const parsedDataSky = res.filter(
        (item) => item.fcstDate === dateKey && item.category === 'SKY'
      );
      const nextDay = Number(dateKey) + 1;
      let parsedDataNextday = res.filter(
        (item) => item.fcstDate === String(nextDay) && item.category === 'SKY'
      );
      let i = 0;
      while (i < 7) {
        parsedDataSky.push(parsedDataNextday[i]);
        i++;
      }
      // TEMP
      const parsedDataTemp = res.filter(
        (item) => item.fcstDate === dateKey && item.category === 'TMP'
      );
      parsedDataNextday = [];
      parsedDataNextday = res.filter(
        (item) => item.fcstDate === String(nextDay) && item.category === 'TMP'
      );
      i = 0;
      while (i < 7) {
        parsedDataTemp.push(parsedDataNextday[i]);
        i++;
      }
      parsedDataSky.forEach((item, idx) => {
        // 데이터합치기 성공✨
        hourlyWeatherToday.push({
          date: item.fcstTime,
          weather: item.fcstValue,
          temp: parsedDataTemp[idx].fcstValue,
        });
      });
      // 카드 랜더링
      const forecastInnerBox = document.querySelector('.forecast-innerBox');
      hourlyWeatherToday.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'forecast-card';
        div.innerHTML = `
                    <div class="card-value-small">${item.date}</div>
                    <img src="./src/assets/images/${findWeatherIcons(
                      item.weather
                    )}" alt="" />
                    <div class="card-value-main">${item.temp}</div>
                `;
        forecastInnerBox.appendChild(div);
      });
    });
} catch (e) {
  console.error(e);
}
