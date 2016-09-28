let Immutable = require('seamless-immutable');

// `entry.answer`: Markdown; support for paragraph checked

module.exports = Immutable({
  col1: [{
    title: `About Spendwallet`,
    entries: [{
      question: `스펜드월렛는 어떤 제품인가요?`,
      answer: `스펜드월렛는 보유하고있는 모든 카드를 한 곳에 통합해주는 카드지갑형 전자제품입니다. 여러 장의 카드를 들고 다닐 필요없이 스펜드월렛으로 언제 어디서든 편리하게 결제와 적립을 할 수 있습니다.`
    }, {
      question: `왜 스펜드월렛이 필요한가요?`,
      answer: `혹시 지갑에 신용, 현금, 그리고 포인트 카드들을 잔뜩 넣어 가지고 다니신다면, 그리고 그 이유가 다양한 혜택을 누리고자함이라면, 당신은 스펜드 월렛이 필요합니다. 당신의 스마트한 소비생활과 트렌디한 패션을 위해 기존의 무겁고 두꺼운 지갑을 똑똑하고 슬림한 스펜드월렛으로 바꿀 필요가 있죠.`
    }, {
      question: `스펜드월렛에 저장할 수 있는 카드 종류는 무엇인가요?`,
      answer: `카드 뒷면에 검은색 마그네틱 선만 있다면 스펜드월렛에 저장하여 사용할 수 있습니다. 즉, 신용카드, 체크카드, 회원카드 그리고 포인트카드까지 모두 통합하여 사용 가능합니다. 그밖에 바코드를 사용하는 포인트카드들은 스펜드 모바일 앱에 저장하여 사용할 수 있습니다.`
    }, {
      question: `스펜드월렛에는 몇 장의 카드를 저장할 수 있나요?`,
      answer: `스펜드월렛에는 최대 20장의 카드를 저장할 수 있습니다. `
    }, {
      question: `배터리 지속시간은 어떻게 되나요?`,
      answer: `한 번 충전하면, 최대 4주까지 사용 할 수 있습니다. 배터리 지속시간은 사용방식에 따라 조금 차이가 있을 수 있습니다.`
    }, {
      question: `지원하는 모바일 운영체제는 무엇인가요?`,
      answer: `안드로이드 4.3 이상, 혹은 아이폰 iOS 8 이상 사용자라면 누구나 스펜드 모바일 앱을 내려받을 수 있으며, 앱을 통해 간편하게 카드를 관리 할 수 있습니다.`
    }]
  },
  {
    title: `How to Use`,
    entries: [{
      question: `어떻게 카드를 등록하나요?`,
      answer: `우선 스펜드 스마트폰 앱을 설치한 후 제품과 함께 받으신 소형 카드리더기를 스마트폰의 이어폰 단자에 연결합니다. 등록하고 싶은 카드를 리더기에 긁으면 블루투스 통신을 통해 스마트폰 앱과 제품에 카드가 등록됩니다.`
    }, {
      question: `스펜드월렛에서 사용하고 싶은 카드 선택은 어떻게 하나요?`,
      answer: `스펜드월렛의 앞면의 좌우 버튼을 사용하여 결제하실 카드를 선택하실 수 있습니다. 또한 앱을 통해 입력한 각 카드의 닉네임을 LED 디스플레이를 통해 확인할 수  있습니다.`
    }, {
      question: `결제는 어떻게 하는 건가요?`,
      answer: `우선 LED 디스플레이를 통해 어떤 카드가 선택되었는지 확인합니다. 스펜드월렛을 카드리더기의 긁는 부분 근처 가까이 갖다 댄 후 제품 앞면의 스펜드 버튼을 눌러 결제를 완료합니다.`
    }, {
      question: `신분증은 어떻게 저장하죠?`,
      answer: `디지털형식으로 저장할 수 없는 신분증은 스펜드월렛 뒷면의 카드 수납공간에 넣어 들고 다닐 수 있습니다. 스펜드월렛은 기존의 지갑을 스마트하게, 완전히 대체합니다.`
    }, {
      question: `스펜드월렛을 쓰는 동안 꼭 블루투스를 켜야하나요?`,
      answer: `휴대폰의 블루투스를 켜지 않아도 별도의 기기처럼 스펜드월렛을 사용하실 수 있습니다.`
    }, {
      question: `지원하는 모바일 운영체제는 무엇인가요?`,
      answer: `안드로이드 4.3 이상 혹은 아이폰 iOS 8 이상 사용자라면 누구나 스펜드 모바일 앱을 내려받을 수 있으며, 앱을 통해 간편하게 카드를 관리 할 수 있습니다.`
    }, {
      question: `스펜드월렛은 ATM 기기에서 사용 가능한가요?`,
      answer: `아쉽지만 스펜드월렛은 ATM기기에서 사용이 불가능합니다. 스펜드월렛 뒷면 카드슬롯을 활용하여 신분증과 ATM카드를 보관하세요.`
    }]
  },
  {
    title: `Technology`,
    entries: [{
      question: `어떤방식으로 어디서나 결제가 가능한건가요?`,
      answer: `스펜드월렛을 카드 리더기에 가까이 가져가면 저희가 자체개발한 마그네틱 보안전송 “Magnetic Flux Emulation (MFE)” 기술이 결제신호를 송출합니다. 이는 마치 일반카드로 긁는것과 것과 동일한 신호를 전달하기 때문에 모든 카드리더기에서 사용 가능합니다.`
    }, {
      question: `스펜드월렛은 다른 올인원 스마트 카드와 어떻게 다른가요?`,
      answer: `스펜드월렛은 다른 올인원 스마트 카드보다 결제 성공률이 더 높습니다. 시중의 모든 올인원 카드를 테스트해보았으나 기존의 스와이프 형식의 결제는 기술적으로 완벽한 결제 성공률을 보장할 수 없었습니다. 따라서 스펜드월렛은 스와이프 방식이 아닌 탭투페이(Tap-to-Pay) 방식을 채택해 완벽에 가까운 결제 성공률을 자랑합니다.`
    }]
  }],
  col2: [{
    title: `Security`,
    entries: [{
      question: `카드정보를 스펜드월렛에 저장할 때 보안 문제가 있지않나요?`,
      answer: `스펜드 모바일 앱에 저장된 카드 정보는 블루투스 표준 보안에 따라 스펜드월렛으로 전송되기 때문에 보안 문제는 걱정하지 않으셔도 됩니다. 또한 모든 개인정보에 대해 스펜드월렛은 은행 수준 (256 bit) 의 암호화 방식을 제공합니다.`
    }, {
      question: `스펜드월렛을 분실하면 어쩌죠?`,
      answer: `스펜드월렛와 스마트폰은 블루투스를 통해 실시간으로 서로의 상태를 확인합니다. 따라서 스펜드월렛이 스마트폰으로부터 20m 떨어져 있을 경우 스마트폰으로 주의 알림을 보냅니다. 또한, 분실시 스펜드월렛을 자동으로 잠금 상태로 전환해 데이터를 보호 및 삭제합니다.`
    }, {
      question: `스마트폰의 블루투스를 키지 않고서도 스펜드월렛의 보안을 유지할 수 있나요?`,
      answer: `스마트폰의 블루투스를 키지 않기를 선호하신다면, 매 결제시 패스코드를 입력하도록 설정하실 수 있으며 보안기능을 꺼두는 것도 가능합니다.`
    }, {
      question: `패스코드는 무엇이고 어떻게 설정하나요?`,
      answer: `패스코드는 카드정보를 안전하게 보호하기 위한 보안장치입니다. 패스코드는 스펜드 모바일 어플리케이션에서 왼쪽, 오른쪽, 그리고 스펜드버튼을 사용해 설정할 수 있으며 이는 스펜드월렛에서도 똑같이 적용됩니다.`
    }, {
      question: `패스코드를 잊어버리면 어떡하죠?`,
      answer: `본인 확인 후 스펜드 모바일 어플리케이션을 통해 다시 설정할 수 있습니다.`
    }]
  }, {
    title: `Order & Shipping`,
    entries: [{
      question: `스펜드월렛은 어디에서 구입할 수 있죠?`,
      answer: `스펜드월렛은 5월 17일부터 미국 크라우드펀딩 인디고고(http://igg.me/at/spendwallet/) 에서 판매합니다.`
    }, {
      question: `언제 제품을 받아볼 수 있나요?`,
      answer: `올해 12월 말부터 순차적으로 배송될 예정입니다.`
    }, {
      question: `국제배송도 가능하나요?`,
      answer: `가능합니다. 그러나 배송 위치에 따라 가격이 상이할 수 있다는 점 알려드립니다.`
    }, {
      question: `인디고고의 선주문 방식은 어떻게 이루어지나요?`,
      answer: `먼저 주문을 하고, 제품을 나중에 받는 주문방식입니다. 생산비용 등의 문제로 대량생산을 할 수 없는 스타트업의 특성상 먼저 주문을 요청받고, 요청받은 만큼의 제품 수량을 생산하는 방식이며, 이를 통해 제품을 제작하는 과정을 공개하여 소비자들과 직접적으로 더 많은 소통을 할 수 있는 주문방식입니다.`
    }, {
      question: `제품 개발은 완료된 상태에서 주문을 받는 것인가요?`,
      answer: `스펜드에 대한 모든 하드웨어 개발은 이미 완료가 되어 있습니다. 여러 방법을 통해 제품의 신뢰성 검증을 진행하고 있으며, 동시에 양산을 준비하고 있습니다.`
    }, {
      question: `선주문 방식인데 왜 결제는 바로 처리되는 건가요?`,
      answer: `제품생산에 들어가려면 제작비용이 필요합니다. 생산에 필요한 비용을 선주문을 통해 준비하여 생산할 수 밖에 없으며, 더 많은 분께 저희가 만든 제품을 전달해드리고자 불가피하게 채택한 주문방식입니다. 스펜드 팀은 선주문에 참여하신 분들을 위해서 제품 외에도 다양한 혜택을 드리기 위해 노력하고 있습니다.`
    }]
  }]
});
