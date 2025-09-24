/**
 * POP 강수확률 % ✅
 * PTY 강수형태 코드값 ✅
 * PCP 1시간강수량 범주(1mm) ✅
 * REH 습도 % ✅
 * SNO 1시간신적설 범주(1cm) ✅
 * SKY 하늘상태 코드값 ✅
 * TMP 1시간기온 °C ✅
 * TMN 일최저기온 °C
 * TMX 일최고기온 °C
 * UUU 풍속(동서성분) m/s ✅
 * VVV 풍속(남북성분) m/s ✅
 * WAV 파고 M ✅
 * VEC 풍향 deg ✅
 * WSD 풍속 m/s ✅
 
 * Pick: TMP(1시간기온), SKY(하늘상태), POP(강수확률), REH(습도), WSD(풍속)
 * +a: 위치, 시간

 * 코드값
 * 하늘상태(SKY) 코드값: 맑음(1), 구름많음(3), 흐림(4)
 * 강수형태(PTY) 코드값: 없음(0), 비(1), 비/눈(2), 눈(3), 소나기(4)
 * 강수량 범주(PCP):  -, null, 0값은 (강수없음) 나머지는 18페이지 참조
 * SNO 1시간신적설 범주(SNO): -, null, 0값은 (적설없음)
 *

 * TMN/TMX(일최저/최고) 는 하루 1회씩만 포함
 * TMN은 새벽(02:00/05:00 차수) 예보에서만 내려옴
 * TMX는 낮(11:00/14:00 차수) 예보에서만 내려옴
 */

function formatDate(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 9
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
}

function render({ location, x, y }) {
    console.log(x);
    console.log(y);

    const today = new Date();
    const todayStr = formatDate(today);
    const hour = today.getHours();
    let baseDate;
    if (hour >= 5) {
        baseDate = todayStr;
    } else {
        const yesterday = new Date(today);
        console.log(yesterday);
        yesterday.setDate(today.getDate() - 1);
        baseDate = formatDate(yesterday);
    }
    fetch(
        `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=9424b102fa31a2cdf077b43d93ffbbd26e040beb866f241236f5a5e7913ab3ea&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${baseDate}&base_time=0500&nx=${x}&ny=${y}`
    )
        .then((res) => res.json())
        .then((data) => {
            const datas = data.response.body.items.item;
            const filtered = datas.filter((item) => item.fcstDate === todayStr && item.fcstTime === '0600');
            const parsedData = {};
            filtered.forEach((item) => {
                parsedData[item.category] = item.fcstValue;
            });
            // SKY(하늘상태)에 따라 이미지변경 추가해야됨 (3가지) 091825
            const weatherNow = document.querySelector('.weather-now');
            // weatherNow.innerHTML = '';
            const div = document.createElement('div');
            div.className = 'weather-card';
            div.innerHTML = `
        <div class="card">
          <div class="card-grid">
            <div class="card-title">location</div>
            <div class="card-value-small">${location}</div>
          </div>
          <div class="card-grid">
            <div class="card-title">Today</div>
            <div class="card-value-small">${todayStr}</div>
          </div>
          <div class="card-grid">
            <div class="card-title">Current Weather</div>
            <img src="./src/assets/images/wind.svg" alt="wind" />
          </div>
          <div class="card-grid">
            <div class="card-title">Temperature</div>
            <div class="card-value-main">${parsedData.TMP}</div>
          </div>
          <div class="card-grid">
            <div>
              <div class="card-title">Precipitation</div>
              <img src="./src/assets/images/cape.svg" alt="cape" class="img-cape" />
            </div>
            <div class="card-value-sub">${parsedData.POP}%</div>
          </div>
          <div class="card-grid">
            <div class="card-title">Humidity</div>
            <div class="card-value-sub">${parsedData.REH}</div>
          </div>
          <div class="card-grid">
            <div class="card-title">Wind speed</div>
            <div class="card-value-sub">${parsedData.WSD}</div>
          </div>
        </div>
      `;
            weatherNow.appendChild(div);
        });
}
render({ location: 'Jungang', x: 57, y: 121 });
