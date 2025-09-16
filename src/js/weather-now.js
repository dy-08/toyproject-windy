/**
 * T1H	기온
 * RN1	1시간 강수량
 * UUU	동서바람성분
 * VVV	남북바람성분
 * REH	습도
 * PTY	강수형태
 * VEC	풍향
 * WSD	풍속
 */

const category = document.querySelectorAll('.category');
const obsrValue = document.querySelectorAll('.obsrValue');
const tbody = document.getElementById('tbody');
const parsedData = {};
const weatherNow = document.getElementById('weather-now');

try {
    fetch(
        'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst?serviceKey=9424b102fa31a2cdf077b43d93ffbbd26e040beb866f241236f5a5e7913ab3ea&pageNo=1&numOfRows=1000&dataType=JSON&base_date=20250916&base_time=0610&nx=57&ny=121'
    )
        .then((res) => res.json())
        .then((data) => {
            const datas = data.response.body.items.item;
            console.log(datas);
            // fetch의 url로 데이터를 받아올 수 있음 ✨
            // 내가 원하는 데이터: 초단기실황 (기온, 1시간 강수량, 동서바람성분, 남북바람성분, 습도, 강수형태, 풍향, 풍속)
            // 공공데이터포털에서의 초단기실황 날씨 데이터는 6시 초기화, 시간당 8개타입으로 분류 됨
            // category 분류
            // obsrValue 해당값
            // 테이블로 뿌려주고 시작
            datas.forEach((item) => {
                parsedData[item.category] = item.obsrValue;
            });

            const div = document.createElement('div');
            div.className = 'weather-card';
            console.log(parsedData);
            div.innerHTML = `
                <div class="card location"><span class="icons icon-location-pin"></span>안산</div>
                <div class="card t1h">
                    <div><span class="icon-temp"></span>temperature</div>
                    <div class="temp-value">${parsedData[T1H]}</div>
                </div>
                <div class="card reh">humidity${parsedData[REH]}</div>
                <div class="card rn1">precipitation${parsedData[RN1]}</div>
                <div class="card wsd">wind speed${parsedData[WSD]}</div>
                `;
            weatherNow.appendChild(div);
        });
} catch (e) {
    console.error(e);
}
