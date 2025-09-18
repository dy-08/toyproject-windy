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
  console.log(dateKey);

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

      res.forEach((item) => {
        console.log(item);
      });
    });
} catch (e) {
  console.error(e);
}
