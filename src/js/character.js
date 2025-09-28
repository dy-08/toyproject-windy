const messages = {
  index: [
    '안녕하세요!\n저는 작은 안내자, Virtual Assistant예요 🧭',
    '원하는 지역을 검색해 날씨 정보를 확인할 수 있어요',
    '검색 가능한 지역: 안산, 서울, 부산, 대구, 인천, 광주, 대전, 울산, 세종',
  ],
  weather: [
    '오늘 6시 기준 최신 날씨를 알려드릴게요 ☀️',
    '상세한 날씨 정보도 함께 확인할 수 있어요 🌡️',
  ],
  forecast: [
    '날씨 예보를 하루 단위로 확인할 수 있어요 🌤️',
    '1시간 간격으로 기온과 날씨를 확인할 수 있어요 ⏰',
    '전체 흐름을 간단히 보고 싶을 때 유용해요 👀',
  ],
  promotions: [
    '이 페이지는 서버 운영을 위해 유료 광고를 노출합니다 💡',
    '웹툰 형식의 광고가 무한 슬라이드로 보여져요 📖',
    '단순히 확인만 하는 페이지라 가볍게 둘러보세요 👀',
  ],
  guide: [
    'Windy 앱과 서비스를 소개하는 페이지예요 📱',
    '버전에 따라 제공되는 기능과 이용 방법을 확인할 수 있어요 🔎',
    '여행이나 일상에서 날씨를 편리하게 활용하는 방법을 알려드립니다 ',
  ],
  default: ['제가 도와드릴까요? 🤔'],
};

export function virtualAssistant(page) {
  const assistantMessages = document.getElementById('assistantMessages');
  const message = messages[page] || messages.default;

  message.forEach((msg, index) => {
    setTimeout(() => {
      assistantMessages.textContent = msg;
    }, 5000 * index);
  });

  assistantMessages.classList.add('appeared');
}
