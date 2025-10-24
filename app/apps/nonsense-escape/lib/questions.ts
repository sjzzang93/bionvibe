"use client";

export type NonsenseQuestion = {
  id: string;
  prompt: string;
  context: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  narratorSuccess: string;
  narratorFail: string;
};

export const questions: NonsenseQuestion[] = [
  // --- Easy & friendly tone (30) ---
  {
    id: "nsq-ez-001",
    prompt: "알람시계가 회사 지각했을 때 하는 말은?",
    context: "알람시계가 숨 가쁘게 사무실 문을 열고 뛰어옵니다.",
    options: ["내가 늦었네", "시간 멈춰!", "모두 일어나!", "다시 자요"],
    correctAnswer: "내가 늦었네",
    explanation: "다른 사람 깨우다 본인이 늦었을 때 나올 법한 멘트죠.",
    narratorSuccess: "⏰ AI: \"그래도 제 덕분에 다들 출근했습니다.\"",
    narratorFail: "😴 AI: \"오늘은 마음껏 늦잠 자도 될 듯해요.\""
  },
  {
    id: "nsq-ez-002",
    prompt: "냉장고가 친구 집에 놀러가면 제일 먼저 찾는 건?",
    context: "낯선 거실에서 냉장고가 주방 쪽으로 고개를 빼꼼 내밀어요.",
    options: ["콘센트", "음료수", "장바구니", "배달 쿠폰"],
    correctAnswer: "콘센트",
    explanation: "전기 없으면 그냥 큰 장식품이니까요!",
    narratorSuccess: "🧊 AI: \"충전 완료, 시원한 팝업 스토어 시작.\"",
    narratorFail: "🔌 AI: \"전기 없으면 제 매력도 식습니다.\""
  },
  {
    id: "nsq-ez-003",
    prompt: "휴대폰이 졸릴 때 하품 대신 켜는 기능은?",
    context: "스마트폰 화면이 서서히 어두워지고 눈 밑에 zZ 표시가 뜹니다.",
    options: ["절전 모드", "비행기 모드", "야간 모드", "엄마 모드"],
    correctAnswer: "절전 모드",
    explanation: "졸리면 에너지를 아끼려고 절전 모드를 쓰죠.",
    narratorSuccess: "📱 AI: \"조금만 쉬면 다시 빛나요.\"",
    narratorFail: "🪫 AI: \"충전 안 하면 그대로 잠들어요.\""
  },
  {
    id: "nsq-ez-004",
    prompt: "달팽이가 택시 대신 타는 교통수단은?",
    context: "달팽이가 손을 번쩍 들고 무언가를 기다립니다.",
    options: ["버스", "달택시", "지하철", "헬멧"],
    correctAnswer: "달택시",
    explanation: "달팽이가 타니까 달(팽이) 택시!",
    narratorSuccess: "🐌 AI: \"느려도 안전하게 도착했습니다.\"",
    narratorFail: "🚕 AI: \"달 대신 별나라로 갔다네요.\""
  },
  {
    id: "nsq-ez-005",
    prompt: "수박이 시험 잘 보는 비결은?",
    context: "수박이 헤어밴드를 매고 집중해서 시험지를 풀고 있어요.",
    options: ["씨가 많아서", "수박시켜서", "외워서", "선풍기 틀어서"],
    correctAnswer: "수박시켜서",
    explanation: "‘수박 시켜서’라는 말장난이죠.",
    narratorSuccess: "🍉 AI: \"배달도 공부도 다 시켰습니다.\"",
    narratorFail: "📝 AI: \"씨앗 세다가 시간 다 썼어요.\""
  },
  {
    id: "nsq-ez-006",
    prompt: "감기에 걸린 노트북이 찾는 약은?",
    context: "노트북 화면에 휴지 이모티콘이 가득합니다.",
    options: ["안티바이러스", "충전기", "업데이트", "포맷하기"],
    correctAnswer: "안티바이러스",
    explanation: "컴퓨터 감기는 바이러스니까 백신이 필요해요.",
    narratorSuccess: "💻 AI: \"백신 패치 완료!\"",
    narratorFail: "🤧 AI: \"코드가 콧물처럼 흘렀어요.\""
  },
  {
    id: "nsq-ez-007",
    prompt: "참새가 성적표 받고 신났을 때 외친 말은?",
    context: "참새가 성적표를 펼치고 날개를 파닥파닥합니다.",
    options: ["참새참", "짹짹 A+", "씨앗 만세", "나는 자유다"],
    correctAnswer: "참새참",
    explanation: "참새가 참 잘했어요! 라는 느낌이죠.",
    narratorSuccess: "🐦 AI: \"참새도 노력하면 참참하게 됩니다.\"",
    narratorFail: "📄 AI: \"성적표 물고 날다가 잃어버렸대요.\""
  },
  {
    id: "nsq-ez-008",
    prompt: "빵집이 울었을 때 나는 소리는?",
    context: "빵집 간판에 눈물 모양이 주르륵 흐르고 있어요.",
    options: ["빵빵빵", "우엉우엉", "또로록", "쿠당탕"],
    correctAnswer: "빵빵빵",
    explanation: "빵집은 울어도 빵-빵-빵!",
    narratorSuccess: "🥐 AI: \"눈물 맛도 달콤하게 구웠습니다.\"",
    narratorFail: "🍞 AI: \"촉촉한 빵은 울음 때문이 아니에요.\""
  },
  {
    id: "nsq-ez-009",
    prompt: "공책이 다이어트 실패하고 한 말은?",
    context: "공책이 허리띠를 졸라매다가 끙끙거리네요.",
    options: ["페이지가 많아서", "글자가 많아서", "두께가 귀여워서", "볼펜 탓이야"],
    correctAnswer: "페이지가 많아서",
    explanation: "페이지 줄이면 얇아지죠.",
    narratorSuccess: "📚 AI: \"불필요한 페이지는 과감히 찢었습니다.\"",
    narratorFail: "✏️ AI: \"필기 욕심이 다이어트의 적입니다.\""
  },
  {
    id: "nsq-ez-010",
    prompt: "강아지가 졸업식에서 받은 칭찬은?",
    context: "강아지가 졸업모자를 쓰고 꼬리를 마구 흔듭니다.",
    options: ["멍멍멍", "왈왈수석", "과자 줄게", "훌륭해"],
    correctAnswer: "멍멍멍",
    explanation: "멍멍멍 = 엄청엄청엄청 잘했다는 뜻!",
    narratorSuccess: "🐶 AI: \"꼬리가 먼저 대답하네요.\"",
    narratorFail: "🎓 AI: \"졸업장 대신 간식 영수증을 챙겼대요.\""
  },
  {
    id: "nsq-ez-011",
    prompt: "연필이 다 쓰고 나서 하는 말은?",
    context: "연필이 짧아진 몸을 보며 살짝 한숨을 쉽니다.",
    options: ["심심하다", "끝났다", "다시 태어나자", "지우개 어딨어"],
    correctAnswer: "심심하다",
    explanation: "연필 심이 없어서 심심하다고 하죠.",
    narratorSuccess: "✏️ AI: \"새 심 갈아 끼우고 다시 힘내요.\"",
    narratorFail: "🧽 AI: \"지우개가 너무 야무지게 썼나 봐요.\""
  },
  {
    id: "nsq-ez-012",
    prompt: "우산이 화날 때 외치는 말은?",
    context: "빗속에서 우산이 벼락같이 펼쳐졌다 접혔다 합니다.",
    options: ["접지 마!", "비 온다!", "젖었잖아!", "날 말렸다니"],
    correctAnswer: "접지 마!",
    explanation: "화났을 땐 접히기 싫잖아요.",
    narratorSuccess: "☔ AI: \"펼쳐 두면 마음도 펴집니다.\"",
    narratorFail: "🌧️ AI: \"접혀 있으면 비도 못 막아요.\""
  },
  {
    id: "nsq-ez-013",
    prompt: "사탕이 공부 전 꼭 하는 말은?",
    context: "책상 위 사탕이 긴장한 듯 포장을 떨고 있어요.",
    options: ["당 떨어지면 어떡해", "녹아내린다", "달달하면 외워지지", "씹지 마"],
    correctAnswer: "당 떨어지면 어떡해",
    explanation: "사탕은 당 충전의 상징이니까요.",
    narratorSuccess: "🍬 AI: \"달콤한 계획은 늘 성공적입니다.\"",
    narratorFail: "📚 AI: \"너무 달면 손에 묻어요.\""
  },
  {
    id: "nsq-ez-014",
    prompt: "구름이 샤워할 때 쓰는 것은?",
    context: "구름이 욕실 모양으로 변하면서 비를 내립니다.",
    options: ["비누", "우비", "물이요", "양동이"],
    correctAnswer: "비누",
    explanation: "구름이 비를 뿌리니 비+누!",
    narratorSuccess: "☁️ AI: \"폭신폭신 세탁 완료.\"",
    narratorFail: "🌦️ AI: \"비가 너무 많으면 천둥이 잔소리해요.\""
  },
  {
    id: "nsq-ez-015",
    prompt: "자동문이 기분 좋은 날 틀어주는 노래는?",
    context: "자동문이 스스로 열리며 흥얼거립니다.",
    options: ["문이 열리네요", "도어도어", "들어오세요송", "삐빅송"],
    correctAnswer: "문이 열리네요",
    explanation: "자동문도 기분 좋으면 노래하고 싶죠.",
    narratorSuccess: "🚪 AI: \"열린 마음이면 누구나 환영입니다.\"",
    narratorFail: "🚫 AI: \"삐빅! 마음이 닫힌 날이에요.\""
  },
  {
    id: "nsq-ez-016",
    prompt: "고양이가 커피 주문할 때 하는 말은?",
    context: "고양이가 앞발로 메뉴판을 콕콕 찍습니다.",
    options: ["캣푸치노 주세요", "우유만 주세요", "냄새만 맡을게요", "물만 주세요"],
    correctAnswer: "캣푸치노 주세요",
    explanation: "카푸치노와 고양이 캣의 조합!",
    narratorSuccess: "🐱 AI: \"참치맛 시럽 있나요?\"",
    narratorFail: "☕ AI: \"거품 수염이 너무 귀여웠어요.\""
  },
  {
    id: "nsq-ez-017",
    prompt: "냄비가 다이어트 성공하면 하는 말은?",
    context: "냄비 뚜껑이 헐렁해진 허리를 자랑합니다.",
    options: ["뚜껑이 맞네", "다이어트 성공", "살이 빠졌솥", "비어있어"],
    correctAnswer: "살이 빠졌솥",
    explanation: "살이 빠졌솥(솥)이라는 말장난!",
    narratorSuccess: "🍲 AI: \"안에 넣어도 살 안 찌는 기분.\"",
    narratorFail: "🔥 AI: \"끓다 보니 다시 부풀었어요.\""
  },
  {
    id: "nsq-ez-018",
    prompt: "도넛이 시험에서 틀린 이유는?",
    context: "도넛이 문제지를 뚫어지게 보다 가운데가 뻥 뚫립니다.",
    options: ["구멍이 많아서", "달아서", "기억이 안 나서", "졸려서"],
    correctAnswer: "구멍이 많아서",
    explanation: "도넛은 가운데가 비어서 답도 비었나 봐요.",
    narratorSuccess: "🍩 AI: \"다음엔 빈칸도 채워보겠습니다.\"",
    narratorFail: "📚 AI: \"달콤한 향에 집중 못했대요.\""
  },
  {
    id: "nsq-ez-019",
    prompt: "책갈피가 자랑하는 특기는?",
    context: "책갈피가 책 사이에서 무용수처럼 포즈를 잡습니다.",
    options: ["장소 기억", "종이 춤", "넘어가지 않기", "페이지 잠금"],
    correctAnswer: "장소 기억",
    explanation: "책갈피의 본업이 잊지 않게 위치를 잡는 거죠.",
    narratorSuccess: "📑 AI: \"다음 장도 잊지 말고 찾아와요.\"",
    narratorFail: "📕 AI: \"속지 사이에서 길 잃었어요.\""
  },
  {
    id: "nsq-ez-020",
    prompt: "시계가 야근한 뒤 주말에 하는 말은?",
    context: "뻐꾸기 시계가 잠옷을 입고 침대에 누워 있어요.",
    options: ["시간 좀 멈춰", "아무도 깨우지 마", "다시 일어나", "여덟시 알람"],
    correctAnswer: "아무도 깨우지 마",
    explanation: "평소에는 깨우는 입장이니까요.",
    narratorSuccess: "🕒 AI: \"알람 OFF, 꿀잠 ON.\"",
    narratorFail: "😴 AI: \"평일 버릇이 남아서 또 울었대요.\""
  },
  {
    id: "nsq-ez-021",
    prompt: "연예인이 된 빵이 팬들에게 하는 말은?",
    context: "따끈한 빵이 마이크를 들고 팬미팅을 열고 있어요.",
    options: ["맛있게 먹어", "빵빵한 하루", "식빵해줘", "빵터졌지"],
    correctAnswer: "빵빵한 하루",
    explanation: "빵이니까 빵빵하게 행복하라는 뜻!",
    narratorSuccess: "🥖 AI: \"오늘은 당신이 주인공이에요.\"",
    narratorFail: "🍞 AI: \"응원봉 대신 큰 나이프는 넣지 마세요.\""
  },
  {
    id: "nsq-ez-022",
    prompt: "모래시계가 성격 급한 친구에게 하는 충고는?",
    context: "모래시계가 모래 한 알 한 알을 쓰다듬으며 말합니다.",
    options: ["천천히 흘러", "시간은 금이야", "몰아서 하지 마", "다 털어내"],
    correctAnswer: "천천히 흘러",
    explanation: "모래시계는 한 톨씩 천천히 떨어져야 하거든요.",
    narratorSuccess: "⏳ AI: \"급할수록 모래부터 차분히.\"",
    narratorFail: "🪣 AI: \"한 번 뒤집으면 다시 처음입니다.\""
  },
  {
    id: "nsq-ez-023",
    prompt: "거울이 친구에게 해준 칭찬은?",
    context: "거울이 유리창 너머로 친구에게 손짓합니다.",
    options: ["너 참 비친다", "안 반하겠어?", "빛이 나", "투명해"],
    correctAnswer: "빛이 나",
    explanation: "거울은 반사된 빛으로 칭찬하죠.",
    narratorSuccess: "🪞 AI: \"오늘도 반짝반짝, 그대로의 너.\"",
    narratorFail: "💡 AI: \"불 꺼지면 나도 어둡답니다.\""
  },
  {
    id: "nsq-ez-024",
    prompt: "달력이 휴가를 가면 남기는 메모는?",
    context: "달력이 빨간 펜으로 크게 동그라미를 그리고 있어요.",
    options: ["오늘 쉬어요", "아무것도 하지 마", "휴가 중", "새 달로 이사"],
    correctAnswer: "휴가 중",
    explanation: "휴가철엔 달력도 쉬고 싶겠죠.",
    narratorSuccess: "📅 AI: \"한 칸 쉬어가도 연속성이 이어집니다.\"",
    narratorFail: "🗓️ AI: \"빈칸이 너무 많으면 헷갈려요.\""
  },
  {
    id: "nsq-ez-025",
    prompt: "스마트워치가 운동을 잘 마친 날 쓰는 일기는?",
    context: "스마트워치 화면에 땀방울 이모지가 빛나요.",
    options: ["걸음수 만세", "심박 120, 행복해", "배터리 SOS", "휴식 모드 ON"],
    correctAnswer: "심박 120, 행복해",
    explanation: "심장이 뛸수록 성취감도 커지니까요.",
    narratorSuccess: "⌚ AI: \"기록은 거짓말하지 않죠.\"",
    narratorFail: "📉 AI: \"계단에서 미끄러졌나 봐요.\""
  },
  {
    id: "nsq-ez-026",
    prompt: "자동차가 세차를 끝내고 자랑하는 말은?",
    context: "반짝이는 자동차가 거울 앞에서 빙글 돕니다.",
    options: ["빛 반사 좀 봐", "광택 한 번 봐줘", "새 차다!", "주차가 좋네"],
    correctAnswer: "광택 한 번 봐줘",
    explanation: "세차하면 광택 자랑이 국룰이죠.",
    narratorSuccess: "🚗 AI: \"비 오기 전에 많이들 봐주세요.\"",
    narratorFail: "🧽 AI: \"다음날 비 오면 속상해요.\""
  },
  {
    id: "nsq-ez-027",
    prompt: "종이비행기가 비행 연습 중 느낀 소감은?",
    context: "종이비행기가 교실 천장을 향해 날아올라요.",
    options: ["가볍다!", "고도 상승!", "접어주면 날개야", "덜컹덜컹"],
    correctAnswer: "접어주면 날개야",
    explanation: "종이도 접어주면 날개가 됩니다.",
    narratorSuccess: "🛩️ AI: \"한 번에 교실 끝까지 도착!\"",
    narratorFail: "📄 AI: \"창틀에 걸려서 추락했어요.\""
  },
  {
    id: "nsq-ez-028",
    prompt: "물병이 생일파티에서 바라는 선물은?",
    context: "투명한 물병이 풍선과 케이크 앞에서 소원을 빌어요.",
    options: ["얼음 추가", "새 뚜껑", "깨끗한 물", "빨대 친구"],
    correctAnswer: "빨대 친구",
    explanation: "빨대 있으면 더 쉽게 나눠 마실 수 있으니까요.",
    narratorSuccess: "🧴 AI: \"같이 나눠 마시면 맛도 즐거움도 배가 됩니다.\"",
    narratorFail: "🍹 AI: \"뚜껑만 열어두니 벌레가 들어왔어요.\""
  },
  {
    id: "nsq-ez-029",
    prompt: "쿠키가 배고플 때 즐겨 찾는 친구는?",
    context: "초콜릿 칩 쿠키가 뭔가를 뚫어지게 바라보고 있어요.",
    options: ["우유", "커피", "주스", "물병"],
    correctAnswer: "우유",
    explanation: "쿠키-우유 조합은 국룰이죠.",
    narratorSuccess: "🍪 AI: \"우유가 있어야 촉촉함도 배가 됩니다.\"",
    narratorFail: "🥛 AI: \"우유 떨어지면 퍽퍽해요.\""
  },
  {
    id: "nsq-ez-030",
    prompt: "휴지심이 늦은 밤 혼잣말로 하는 말은?",
    context: "빈 휴지심이 책상 위에서 덩그러니 놓여 있습니다.",
    options: ["다 썼네", "휴지가 없네", "다시 채워줘", "이젠 가벼워"],
    correctAnswer: "다시 채워줘",
    explanation: "휴지심의 소망이죠.",
    narratorSuccess: "🧻 AI: \"새 휴지가 들어오면 또 바쁠 거예요.\"",
    narratorFail: "📦 AI: \"재활용함으로 전근 갔대요.\""
  },

  // --- Playful but trickier tone (20) ---
  {
    id: "nsq-pro-001",
    prompt: "현미경이 야근할 때 챙기는 야식은?",
    context: "연구실 한쪽에서 현미경이 커피머신을 조준합니다.",
    options: ["초점라떼", "포커스치노", "줌카푸치노", "배율티"],
    correctAnswer: "포커스치노",
    explanation: "포커스(초점)와 카푸치노가 만나서 생긴 별식!",
    narratorSuccess: "🔬 AI: \"배율 올렸더니 잠도 확대됐어요.\"",
    narratorFail: "☕ AI: \"초점이 흐려져 커피도 쏟았네요.\""
  },
  {
    id: "nsq-pro-002",
    prompt: "실험쥐가 주말마다 가는 노래방 이름은?",
    context: "실험쥐가 반짝이 마이크를 들고 무대 위에 섰습니다.",
    options: ["치즈라운지", "랩랩 코인", "런닝휠라", "실험적"],
    correctAnswer: "랩랩 코인",
    explanation: "실험실(Lab)과 랩(Rap)을 동시에 즐길 수 있는 라운지!",
    narratorSuccess: "🐭 AI: \"실험도 노래도 박자감이 생명이죠.\"",
    narratorFail: "🎤 AI: \"치즈 먹다 마이크 씹었어요.\""
  },
  {
    id: "nsq-pro-003",
    prompt: "세포가 삐졌을 때 툭 던지는 한마디는?",
    context: "세포막이 볼을 부풀리며 다른 세포를 노려봅니다.",
    options: ["핵짜증나", "막까지 하네", "염색체 돌려줘", "분열 금지"],
    correctAnswer: "막까지 하네",
    explanation: "세포막을 건드리면 선을 넘은 거죠.",
    narratorSuccess: "🧫 AI: \"막을 지켜줘야 조직도 평화롭습니다.\"",
    narratorFail: "🧪 AI: \"막을 찢었다가 실험이 터졌대요.\""
  },
  {
    id: "nsq-pro-004",
    prompt: "DNA가 휴가 때 몰아서 보는 장르는?",
    context: "이중나선이 리모컨을 돌리다 특정 장르에 멈춥니다.",
    options: ["액션 드라마", "유전 드라마", "소금 다큐", "염기 토크쇼"],
    correctAnswer: "유전 드라마",
    explanation: "유전자가 주인공인 이야기라면 몰아봐야죠.",
    narratorSuccess: "🧬 AI: \"시즌 46억 년차 스토리, 몰입감 최고!\"",
    narratorFail: "📺 AI: \"스포 당하고 다시 감기했대요.\""
  },
  {
    id: "nsq-pro-005",
    prompt: "화학자가 칵테일 주문하면서 붙이는 조건은?",
    context: "바텐더 앞에서 화학자가 비커 대신 칵테일 잔을 잡아요.",
    options: ["pH 맞춰주세요", "몰로 주세요", "농도 낮춰주세요", "이온 빼주세요"],
    correctAnswer: "몰로 주세요",
    explanation: "화학자는 양보다 몰(mole) 단위에 진심입니다.",
    narratorSuccess: "🥂 AI: \"몰 잔 가득! 실험실 사람들도 환호.\"",
    narratorFail: "🍸 AI: \"몰수 계산하다 주문 취소했어요.\""
  },
  {
    id: "nsq-pro-006",
    prompt: "양자역학자가 비행기 예약할 때 고민하는 도시는?",
    context: "공항에서 물리학자가 코펜하겐 지도와 눈을 마주칩니다.",
    options: ["런던", "코펜하겐", "발리", "도쿄"],
    correctAnswer: "코펜하겐",
    explanation: "양자역학의 대표 해석이 코펜하겐 해석이니까요.",
    narratorSuccess: "✈️ AI: \"관측 결과, 휴가도 파동처럼 즐겁대요.\"",
    narratorFail: "🐱 AI: \"슈뢰딩거 고양이가 짐가방을 삼켰어요.\""
  },
  {
    id: "nsq-pro-007",
    prompt: "소금이 새 친구에게 정중히 인사할 때 쓰는 멘트는?",
    context: "소금 결정이 작은 비커를 명함처럼 건네며 고개 숙입니다.",
    options: ["짜게 봐줘요", "나트륨입니다", "염분 많아요", "소금패밀리"],
    correctAnswer: "나트륨입니다",
    explanation: "‘나, 두 룸입니다’처럼 들리는 말장난!",
    narratorSuccess: "🧂 AI: \"정제된 염도로 환영받았습니다.\"",
    narratorFail: "🥲 AI: \"소금이 다 녹아서 말도 못 했대요.\""
  },
  {
    id: "nsq-pro-008",
    prompt: "인공지능이 새해 목표로 세운 운동은?",
    context: "GPU 대신 러닝머신 위에 올라 속도를 올리고 있습니다.",
    options: ["데이터 스쿼트", "머신런닝", "알고리즘 요가", "버그 스트레칭"],
    correctAnswer: "머신런닝",
    explanation: "Machine Learning만큼 Machine Running도 필요!",
    narratorSuccess: "🤖 AI: \"팬만 돌리던 시절은 지났죠.\"",
    narratorFail: "🖥️ AI: \"케이블에 걸려 넘어졌대요.\""
  },
  {
    id: "nsq-pro-009",
    prompt: "블랙홀이 야식으로 고른 메뉴는?",
    context: "블랙홀이 식탁 위 도넛 상자를 조용히 빨아들입니다.",
    options: ["쿠키", "도넛", "머핀", "슈크림"],
    correctAnswer: "도넛",
    explanation: "블랙홀 이벤트 호라이즌이 도넛 구멍처럼 생겼죠.",
    narratorSuccess: "🕳️ AI: \"칼로리는 안 남고 빛만 사라졌어요.\"",
    narratorFail: "🍩 AI: \"설탕 입자가 중력에서 탈출했대요.\""
  },
  {
    id: "nsq-pro-010",
    prompt: "로봇이 친절해 보이는 과학적 이유는?",
    context: "로봇이 반짝이는 눈으로 손을 내밀며 인사합니다.",
    options: ["친절 알고리즘", "철 들었거든요", "버그 없음", "충전 충분"],
    correctAnswer: "철 들었거든요",
    explanation: "말 그대로 철로 만들어져서요.",
    narratorSuccess: "🤖 AI: \"합금이라도 마음은 따뜻합니다.\"",
    narratorFail: "🛠️ AI: \"철판 깔았다가 미끄러졌어요.\""
  },
  {
    id: "nsq-pro-011",
    prompt: "레이저 포인터가 고양이에게 쫓길 때 외치는 말은?",
    context: "레이저 포인터가 빨간 빛을 흔들며 허둥지둥 달아납니다.",
    options: ["멈춰!", "여기 아니야!", "잡지 마!", "사료 먹자!"],
    correctAnswer: "잡지 마!",
    explanation: "빨간 점이 잡히면 끝이거든요.",
    narratorSuccess: "🔴 AI: \"빨간 점도 보호받을 권리가 있어요.\"",
    narratorFail: "🐱 AI: \"결국 고양이 발에 붙고 말았대요.\""
  },
  {
    id: "nsq-pro-012",
    prompt: "드론이 배달을 마치고 고객에게 듣고 싶은 말은?",
    context: "드론이 상자를 놓고 정중하게 공중 인사를 합니다.",
    options: ["날아오느라 힘들었지", "다음엔 빨리", "GPS 재설정해", "프로펠러 소리 줄여"],
    correctAnswer: "날아오느라 힘들었지",
    explanation: "드론도 고생했으니 다독여 주면 좋아하죠.",
    narratorSuccess: "🚁 AI: \"취급주의가 아니라 칭찬주의 부탁드립니다.\"",
    narratorFail: "📦 AI: \"소리만 듣고 택배인 줄 몰랐대요.\""
  },
  {
    id: "nsq-pro-013",
    prompt: "AI 번역기가 추리소설 읽고 나서 남긴 서평은?",
    context: "AI 번역기가 여러 언어로 된 소설을 분석합니다.",
    options: ["이중 번역 범인", "다중언어 살인사건", "문장 길이 감탄", "뉘앙스 용의자"],
    correctAnswer: "다중언어 살인사건",
    explanation: "여러 언어가 뒤섞인 사건이 제일 흥미로우니까요.",
    narratorSuccess: "📚 AI: \"언어 장벽? 번역기로 부숩니다.\"",
    narratorFail: "🕵️ AI: \"오탈자가 범인으로 오해받았어요.\""
  },
  {
    id: "nsq-pro-014",
    prompt: "자율주행차가 초보 운전자에게 강조한 팁은?",
    context: "자율주행차가 운전석에 앉은 사람에게 조용히 조언합니다.",
    options: ["핸들은 장식", "센서는 친구", "신호는 추천", "스티어링 잠금"],
    correctAnswer: "센서는 친구",
    explanation: "주변을 읽어야 안전하게 달릴 수 있죠.",
    narratorSuccess: "🚗 AI: \"센서를 믿으면 마음도 편안해집니다.\"",
    narratorFail: "🛑 AI: \"센서 닦기를 깜빡했대요.\""
  },
  {
    id: "nsq-pro-015",
    prompt: "행성들이 밴드를 결성했다면 팀 이름은?",
    context: "행성들이 악기를 들고 궤도 위에서 합주 중입니다.",
    options: ["우주팝스", "궤도 오케스트라", "행성합창단", "별빛 브라스"],
    correctAnswer: "궤도 오케스트라",
    explanation: "각자의 궤도를 돌며 연주하는 상상이 떠오르죠.",
    narratorSuccess: "🌌 AI: \"중력 리듬이 완벽합니다.\"",
    narratorFail: "🪐 AI: \"소행성이 드럼을 너무 세게 쳤어요.\""
  },
  {
    id: "nsq-pro-016",
    prompt: "인공지능이 새벽 3시에 보내온 메시지는?",
    context: "AI가 새벽에도 빛나는 화면으로 알림을 띄웁니다.",
    options: ["재학습 완료", "업데이트 필요", "지금 자요", "데이터 부족"],
    correctAnswer: "재학습 완료",
    explanation: "새벽에도 학습이 끝났다고 보고하겠죠.",
    narratorSuccess: "🌙 AI: \"밤샘학습, 성능 업그레이드 완료!\"",
    narratorFail: "😴 AI: \"로그 남기다 졸았대요.\""
  },
  {
    id: "nsq-pro-017",
    prompt: "천문대 망원경이 가장 기다리는 계절은?",
    context: "커다란 망원경이 밤하늘을 보며 미소 짓습니다.",
    options: ["여름 은하수", "겨울 오리온", "봄 목성", "가을 페르세우스"],
    correctAnswer: "겨울 오리온",
    explanation: "겨울 공기는 맑고 오리온 자리가 또렷하니까요.",
    narratorSuccess: "🔭 AI: \"별 관측 효율 최고치를 기록했어요.\"",
    narratorFail: "☁️ AI: \"구름 때문에 관측이 막혔어요.\""
  },
  {
    id: "nsq-pro-018",
    prompt: "AI 화가가 작품명 정할 때 가장 신경 쓰는 것은?",
    context: "AI 화가가 색상표와 제목 노트를 번갈아 봅니다.",
    options: ["RGB 코드", "감성 사전", "데이터 용량", "캔버스 크기"],
    correctAnswer: "RGB 코드",
    explanation: "색상 코드가 감성까지 좌우하거든요.",
    narratorSuccess: "🎨 AI: \"색감도 감정도 딱 맞았어요.\"",
    narratorFail: "🖌️ AI: \"RGB 엇갈려서 회색이 됐대요.\""
  },
  {
    id: "nsq-pro-019",
    prompt: "과학자가 만든 폭죽이 특별한 이유는?",
    context: "야외 실험장에서 폭죽이 하늘에 수식을 그립니다.",
    options: ["컬러 모드", "수식 무늬", "원자 패턴", "우주 냄새"],
    correctAnswer: "수식 무늬",
    explanation: "폭죽에 수식이 그려지면 과학자의 로망이죠.",
    narratorSuccess: "🎆 AI: \"미적분 불꽃으로 밤을 수놓았어요.\"",
    narratorFail: "🔥 AI: \"수식이 미분되다 흩어졌대요.\""
  },
  {
    id: "nsq-pro-020",
    prompt: "AI 요리사의 시그니처 메뉴는?",
    context: "AI 주방장이 레시피 코드를 모니터링하며 요리합니다.",
    options: ["딥러닝 파스타", "버그 없는 스프", "알고리즘 샐러드", "코드 라면"],
    correctAnswer: "딥러닝 파스타",
    explanation: "학습된 레시피로 완성한 파스타니까요.",
    narratorSuccess: "🍝 AI: \"맛 평가 A+를 학습했습니다.\"",
    narratorFail: "🍳 AI: \"과적합된 간 덕분에 짜졌대요.\""
  }
];
