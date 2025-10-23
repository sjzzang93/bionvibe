const fs = require('fs');

// 이미지 번호별 경고등 매핑 (이미지 설명 기반)
const imageMapping = {
  1: { id: "high-beam-assist", icon: "🔦🤖", desc: "자동 하이빔 결함" },
  2: { id: "power-steering", icon: "🛞⚠️", desc: "파워 스티어링 결함" },
  3: { id: "headlight-on", icon: "💡", desc: "하향등" },
  4: { id: "washer-fluid", icon: "💧🪟", desc: "워셔액 부족" },
  5: { id: "brake-pad-wear", icon: "🛑⚠️", desc: "브레이크 패드 마모" },
  6: { id: "start-stop", icon: "⏱️", desc: "시작-정지 타이머" },
  7: { id: "turn-signal", icon: "↔️", desc: "방향지시등" },
  8: { id: "reminder", icon: "ℹ️", desc: "일반 알림" },
  9: { id: "ice-warning", icon: "❄️", desc: "낮은 외부 온도/결빙" },
  10: { id: "info", icon: "ℹ️", desc: "정보 메시지" },
  11: { id: "glow-plug", icon: "🔌", desc: "예열 플러그(디젤)" },
  12: { id: "cruise-control", icon: "🚗📡", desc: "어댑티브 크루즈" },
  13: { id: "immobilizer", icon: "🔐", desc: "이모빌라이저 결함" },
  14: { id: "key-not-detected", icon: "🔑❌", desc: "키 미감지" },
  15: { id: "keyless-fault", icon: "🔑📡", desc: "키리스 시스템 결함" },
  16: { id: "general-warning", icon: "⚠️", desc: "일반 경고" },
  17: { id: "tpms-fault", icon: "🛞⚠️", desc: "타이어 압력 시스템 결함" },
  18: { id: "cruise-active", icon: "🚗✓", desc: "크루즈 컨트롤 작동" },
  19: { id: "parking-brake", icon: "🅿️", desc: "주차 브레이크" },
  20: { id: "high-beam", icon: "💡🔵", desc: "상향등 작동" },
  21: { id: "tire-pressure", icon: "🛞❗", desc: "타이어 압력 경고" },
  22: { id: "daytime-light", icon: "☀️", desc: "주간 주행등" },
  23: { id: "auto-headlight-fault", icon: "💡⚙️", desc: "자동 헤드라이트 결함" },
  24: { id: "collision-warning", icon: "⚠️🚗", desc: "거리 경고/충돌 방지" },
  25: { id: "dpf-warning", icon: "🔥🔧", desc: "DPF 경고" },
  26: { id: "fuel-cap", icon: "⛽🔓", desc: "연료 캡 열림" },
  27: { id: "door-open", icon: "🚪", desc: "도어 열림" },
  28: { id: "rear-fog", icon: "🌫️🔴", desc: "후방 안개등" },
  29: { id: "front-fog", icon: "🌫️🔴", desc: "전방 안개등" },
  30: { id: "seatbelt", icon: "🔒👤", desc: "안전벨트 미착용" },
  31: { id: "battery-charge", icon: "🔋", desc: "배터리 충전 경고" },
  32: { id: "parking-sensor", icon: "🅿️📡", desc: "주차 센서" },
  33: { id: "service", icon: "🔧", desc: "정비 필요" },
  34: { id: "recirculation", icon: "🔄", desc: "내기 순환" },
  35: { id: "fog-light", icon: "🌫️", desc: "안개등" },
  36: { id: "lane-departure", icon: "⚠️🛣️", desc: "차선 이탈 경고" },
  37: { id: "pedestrian-warning", icon: "🚶⚠️", desc: "보행자 경고" },
  38: { id: "airbag", icon: "💺❌", desc: "에어백 결함" },
  39: { id: "brake-system", icon: "🛑❗", desc: "브레이크 시스템 경고" },
  40: { id: "low-fuel", icon: "⛽📉", desc: "연료 부족" },
  41: { id: "airbag-off", icon: "💺⭕", desc: "동승석 에어백 꺼짐" },
  42: { id: "general-fault", icon: "🔧", desc: "일반 결함" },
  43: { id: "low-beam", icon: "💡", desc: "하향등 작동" },
  44: { id: "trunk-open", icon: "🚗📦", desc: "트렁크 열림" },
  45: { id: "eco-mode", icon: "🍃", desc: "ECO 모드" },
  46: { id: "hill-descent", icon: "⛰️⬇️", desc: "언덕 내리막 제어" },
  47: { id: "engine-overheat", icon: "🌡️❗", desc: "냉각수 온도 경고" },
  48: { id: "abs", icon: "🅰️🅱️", desc: "ABS 결함" },
  49: { id: "washer-fluid-low", icon: "💧", desc: "워셔액 부족" },
  50: { id: "door-ajar", icon: "🚪", desc: "도어 열림" },
  51: { id: "traction-off", icon: "⚠️🚗", desc: "트랙션 컨트롤 꺼짐" },
  52: { id: "fuel-low", icon: "⛽❗", desc: "연료 부족" },
  53: { id: "transmission-fault", icon: "⚙️❗", desc: "변속기 결함" },
  54: { id: "check-engine", icon: "🔧❗", desc: "엔진 결함" },
  55: { id: "seatbelt-reminder", icon: "🔒👤", desc: "안전벨트 미착용" },
  56: { id: "oil-pressure", icon: "🛢️❗", desc: "엔진 오일 압력 저하" },
  57: { id: "defrost", icon: "❄️🔥", desc: "서리 제거" },
  58: { id: "door-open-alt", icon: "🚪", desc: "도어 열림" },
  59: { id: "traction-control", icon: "🚗💨", desc: "트랙션 컨트롤" },
  60: { id: "washer", icon: "💧", desc: "워셔액" },
  61: { id: "engine-check-alt", icon: "⚙️⚠️", desc: "엔진 체크" },
  62: { id: "rear-defrost", icon: "🔥🪟", desc: "후방 열선" },
  63: { id: "auto-wiper", icon: "🌧️⚙️", desc: "자동 와이퍼" },
  64: { id: "auto-defrost", icon: "🪟🤖", desc: "자동 서리 제거" }
};

// 평균 수리비 로드
const avgCosts = require('./avg-by-number.json');
const costMap = {};
avgCosts.forEach(item => {
  costMap[item.num] = item.avg;
});

// 현재 JSON 로드
const data = JSON.parse(fs.readFileSync('./lib/car-warning-lights-data.json', 'utf8'));

// 키워드로 JSON ID 찾기
function findJsonId(imageNum, mapping) {
  const desc = mapping.desc.toLowerCase();
  
  // 직접 매칭 시도
  const keywords = {
    '파워 스티어링': 'power-steering',
    '배터리': 'battery-charge',
    'abs': 'abs',
    '에어백': 'airbag',
    '브레이크 시스템': 'brake-system',
    '브레이크 패드': 'brake-pad',
    '도어': 'door-open',
    '안전벨트': 'seatbelt',
    '트렁크': 'trunk-open',
    '연료': 'low-fuel',
    '주차 브레이크': 'parking-brake',
    '엔진 오일': 'oil-pressure',
    '냉각수': 'engine-overheat',
    '타이어 압력': 'tire-pressure',
    '엔진 체크': 'check-engine',
    '엔진 결함': 'check-engine',
    '워셔액': 'washer-fluid'
  };
  
  for (const [key, id] of Object.entries(keywords)) {
    if (desc.includes(key.toLowerCase())) {
      const found = data.warningLights.find(l => l.id === id);
      if (found) return id;
    }
  }
  
  return null;
}

// 업데이트 적용
let updatedCount = 0;
let notFoundCount = 0;

console.log('🔄 경고등 업데이트 시작...\n');

Object.entries(imageMapping).forEach(([num, mapping]) => {
  const imageNum = parseInt(num);
  const jsonId = findJsonId(imageNum, mapping);
  const avgCost = costMap[imageNum] || 100000;
  
  if (jsonId) {
    const light = data.warningLights.find(l => l.id === jsonId);
    if (light) {
      light.icon = mapping.icon;
      light.repairInfo.estimatedCost.average = avgCost;
      light.repairInfo.estimatedCost.min = Math.floor(avgCost * 0.5);
      light.repairInfo.estimatedCost.max = Math.ceil(avgCost * 2);
      
      console.log(`✓ #${imageNum} ${mapping.desc} → ${jsonId}: ${mapping.icon} (${avgCost.toLocaleString()}원)`);
      updatedCount++;
    }
  } else {
    console.log(`✗ #${imageNum} ${mapping.desc} → 매칭 실패`);
    notFoundCount++;
  }
});

// 백업 & 저장
fs.writeFileSync('./lib/car-warning-lights-data.json.backup', JSON.stringify(data, null, 2));
fs.writeFileSync('./lib/car-warning-lights-data.json', JSON.stringify(data, null, 2));

console.log(`\n✅ 업데이트 완료: ${updatedCount}개 성공, ${notFoundCount}개 실패`);
console.log(`📁 백업: lib/car-warning-lights-data.json.backup`);








