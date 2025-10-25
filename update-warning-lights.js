const fs = require('fs');

// GPT-5 업데이트 데이터
const updates = {
  "updatesByNumber": [
    { "num": 1,  "id": "front-fog-lamp",            "icon": "🌫️🔦", "cost": { "min": 30000, "max": 150000, "average": 80000 } },
    { "num": 2,  "id": "steering-fault",            "icon": "🛞⚠️", "cost": { "min": 150000, "max": 900000, "average": 380000 } },
    { "num": 3,  "id": "headlamp-on",               "icon": "🔦",   "cost": { "min": 30000, "max": 150000, "average": 80000 } },
    { "num": 4,  "id": "washer-fluid-low",          "icon": "💧🪟", "cost": { "min": 0,      "max": 50000,  "average": 10000 } },
    { "num": 5,  "id": "rear-defrost",              "icon": "🌫️🪟", "cost": { "min": 30000, "max": 200000, "average": 90000 } },
    { "num": 6,  "id": "engine-start-glow-wait",    "icon": "⚡️🌀", "cost": { "min": 0,      "max": 50000,  "average": 20000 } },
    { "num": 7,  "id": "turn-signal",               "icon": "↔️",   "cost": { "min": 30000, "max": 100000, "average": 60000 } },
    { "num": 8,  "id": "traction-control-slip",     "icon": "🚗🌀", "cost": { "min": 0,      "max": 200000, "average": 80000 } },
    { "num": 9,  "id": "snow-mode-info",            "icon": "❄️ℹ️", "cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 10, "id": "info-indicator",            "icon": "ℹ️",   "cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 11, "id": "glow-plug-diesel",          "icon": "⚡️🌀", "cost": { "min": 100000,"max": 400000, "average": 220000 } },
    { "num": 12, "id": "rear-fog-lamp",             "icon": "🌫️🔦", "cost": { "min": 30000, "max": 150000, "average": 80000 } },
    { "num": 13, "id": "wipers-auto-rain",          "icon": "🌧️🪟", "cost": { "min": 0,      "max": 150000, "average": 60000 } },
    { "num": 14, "id": "air-suspension-fault",      "icon": "🛞🔼", "cost": { "min": 200000,"max": 1500000,"average": 700000 } },
    { "num": 15, "id": "trailer-hitch",             "icon": "🔗🚗", "cost": { "min": 0,      "max": 200000, "average": 60000 } },
    { "num": 16, "id": "key-info-immobilizer",      "icon": "🔑❓", "cost": { "min": 0,      "max": 300000, "average": 60000 } },
    { "num": 17, "id": "cruise-control-active",     "icon": "🧭🚗", "cost": { "min": 0,      "max": 200000, "average": 80000 } },
    { "num": 18, "id": "power-steering-fault",      "icon": "🛞🔧", "cost": { "min": 150000,"max": 1200000,"average": 450000 } },
    { "num": 19, "id": "airbag-srs-fault",          "icon": "💺",   "cost": { "min": 150000,"max": 1500000,"average": 600000 } },
    { "num": 20, "id": "high-beam",                 "icon": "🔦⬆️", "cost": { "min": 30000, "max": 150000, "average": 80000 } },
    { "num": 21, "id": "tpms-low",                  "icon": "🛞❗", "cost": { "min": 60000, "max": 180000, "average": 120000 } },
    { "num": 22, "id": "daytime-running",           "icon": "🔆",   "cost": { "min": 0,      "max": 150000, "average": 60000 } },
    { "num": 23, "id": "engine-coolant-temp-high",  "icon": "🌡️",  "cost": { "min": 150000,"max": 1500000,"average": 650000 } },
    { "num": 24, "id": "steering-fault-alt",        "icon": "🛞⚠️", "cost": { "min": 150000,"max": 900000, "average": 380000 } },
    { "num": 25, "id": "tow-hook",                  "icon": "🪝🚗", "cost": { "min": 0,      "max": 150000, "average": 60000 } },
    { "num": 26, "id": "parking-sensor",            "icon": "🅿️📡", "cost": { "min": 60000, "max": 200000, "average": 120000 } },
    { "num": 27, "id": "car-on-jack-lift",          "icon": "🛠️🚗", "cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 28, "id": "lane-departure-assist",     "icon": "🛣️🧭", "cost": { "min": 80000, "max": 500000, "average": 220000 } },
    { "num": 29, "id": "engine-preheat-diesel",     "icon": "🔥🌡️", "cost": { "min": 100000,"max": 400000, "average": 220000 } },
    { "num": 30, "id": "parking-brake",             "icon": "🅿️",   "cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 31, "id": "battery-charge",            "icon": "🔋",   "cost": { "min": 120000,"max": 900000, "average": 280000 } },
    { "num": 32, "id": "parking-assist-auto",       "icon": "🅿️🤖", "cost": { "min": 0,      "max": 300000, "average": 120000 } },
    { "num": 33, "id": "hazard-triangle",           "icon": "⚠️",   "cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 34, "id": "high-beam-assist",          "icon": "🔦🤖", "cost": { "min": 80000, "max": 300000, "average": 180000 } },
    { "num": 35, "id": "headlamp-aim",              "icon": "🔦📐", "cost": { "min": 60000, "max": 250000, "average": 150000 } },
    { "num": 36, "id": "low-beam",                  "icon": "🔦⬇️", "cost": { "min": 30000, "max": 200000, "average": 90000 } },
    { "num": 37, "id": "front-fog-lamp-on",         "icon": "🌫️🔦", "cost": { "min": 30000, "max": 150000, "average": 80000 } },
    { "num": 38, "id": "auto-headlight",            "icon": "🔦🤖", "cost": { "min": 0,      "max": 150000, "average": 60000 } },
    { "num": 39, "id": "rear-fog-lamp-on",          "icon": "🌫️🔦", "cost": { "min": 30000, "max": 150000, "average": 80000 } },
    { "num": 40, "id": "passenger-airbag-off",      "icon": "💺🚫","cost": { "min": 0,      "max": 100000, "average": 40000 } },
    { "num": 41, "id": "low-fuel",                  "icon": "⛽⚠️","cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 42, "id": "stability-control-slip",    "icon": "🚗💫","cost": { "min": 0,      "max": 200000, "average": 80000 } },
    { "num": 43, "id": "service-vehicle",           "icon": "🔧",   "cost": { "min": 80000, "max": 800000, "average": 350000 } },
    { "num": 44, "id": "headlight-leveling",        "icon": "🔦↕️","cost": { "min": 60000, "max": 250000, "average": 150000 } },
    { "num": 45, "id": "eco-mode",                  "icon": "🟩ECO","cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 46, "id": "seatbelt",                  "icon": "💺🪢","cost": { "min": 0,      "max": 50000,  "average": 20000 } },
    { "num": 47, "id": "coolant-level-low",         "icon": "💧🌡️","cost": { "min": 80000, "max": 400000, "average": 180000 } },
    { "num": 48, "id": "engine-oil-pressure",       "icon": "⚙️",  "cost": { "min": 150000,"max": 1200000,"average": 450000 } },
    { "num": 49, "id": "abs-fault",                 "icon": "⚠️",  "cost": { "min": 120000,"max": 600000, "average": 280000 } },
    { "num": 50, "id": "engine-overheat-stop",      "icon": "🔥🌡️","cost": { "min": 150000,"max": 1500000,"average": 650000 } },
    { "num": 51, "id": "child-lock",                "icon": "👶🔒","cost": { "min": 0,      "max": 100000, "average": 30000 } },
    { "num": 52, "id": "door-open",                 "icon": "🚪",   "cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 53, "id": "bonnet-open",               "icon": "🚗🛠️","cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 54, "id": "brake-system",              "icon": "🛑",   "cost": { "min": 100000,"max": 700000, "average": 280000 } },
    { "num": 55, "id": "airbag-fault-alt",          "icon": "💺",   "cost": { "min": 150000,"max": 1500000,"average": 600000 } },
    { "num": 56, "id": "immobilizer-security",      "icon": "🔒🚗","cost": { "min": 0,      "max": 300000, "average": 60000 } },
    { "num": 57, "id": "engine-oil-level",          "icon": "🛢️",  "cost": { "min": 30000, "max": 250000, "average": 120000 } },
    { "num": 58, "id": "front-defrost",             "icon": "🪟🌬️","cost": { "min": 30000, "max": 200000, "average": 90000 } },
    { "num": 59, "id": "trunk-open",                "icon": "🚗📦","cost": { "min": 0,      "max": 30000,  "average": 0 } },
    { "num": 60, "id": "esc-slip",                  "icon": "🚗💫","cost": { "min": 0,      "max": 200000, "average": 80000 } },
    { "num": 61, "id": "washer-wipe",               "icon": "🪟↔️","cost": { "min": 30000, "max": 120000, "average": 70000 } },
    { "num": 62, "id": "engine-check",              "icon": "🔧",  "cost": { "min": 80000, "max": 800000, "average": 350000 } },
    { "num": 63, "id": "rear-wiper",                "icon": "🪟↔️","cost": { "min": 30000, "max": 120000, "average": 70000 } },
    { "num": 64, "id": "defrost-auto",              "icon": "🪟🤖","cost": { "min": 0,      "max": 150000, "average": 60000 } }
  ]
};

// 현재 JSON 파일 읽기
const data = JSON.parse(fs.readFileSync('lib/car-warning-lights-data.json', 'utf8'));

// ID로 매핑 생성
const updateMap = {};
updates.updatesByNumber.forEach(update => {
  updateMap[update.id] = update;
});

// 업데이트 적용
let updatedCount = 0;
data.warningLights.forEach(light => {
  const update = updateMap[light.id];
  if (update) {
    light.icon = update.icon;
    light.repairInfo.estimatedCost.min = update.cost.min;
    light.repairInfo.estimatedCost.max = update.cost.max;
    light.repairInfo.estimatedCost.average = update.cost.average;
    updatedCount++;
    console.log(`✓ ${light.id}: ${light.icon} (${update.cost.average.toLocaleString()}원)`);
  }
});

// 백업 생성
fs.writeFileSync('lib/car-warning-lights-data.json.backup', JSON.stringify(data, null, 2));

// 업데이트된 JSON 저장
fs.writeFileSync('lib/car-warning-lights-data.json', JSON.stringify(data, null, 2));

console.log(`\n✅ 업데이트 완료: ${updatedCount}개 경고등`);
console.log(`📁 백업: lib/car-warning-lights-data.json.backup`);














