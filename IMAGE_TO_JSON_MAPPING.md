# 사진 경고등 번호 → JSON ID 매핑 가이드

## 📸 첨부 이미지 정보
- 총 64개 경고등 (번호 1~64)
- 실제 차량 계기판 경고등 디자인

## 📊 현재 JSON 데이터
- 총 69개 경고등
- 파일: `lib/car-warning-lights-data.json`

---

## 🔍 매핑 작업 필요

아래 단계로 진행하세요:

### 1단계: 현재 경고등 목록 확인
```bash
cat CURRENT_WARNING_LIGHTS_LIST.md
```

### 2단계: 이미지와 비교
첨부하신 이미지의 각 번호(1~64)를 보면서, 현재 JSON의 69개 중 어떤 것과 매칭되는지 확인합니다.

예시:
- 이미지 #1 (자동 하이빔 결함) → JSON의 어떤 ID?
- 이미지 #2 (파워 스티어링 결함) → JSON의 `power-steering`?
- 이미지 #32 (배터리 충전 경고) → JSON의 `battery-charge`

### 3단계: 매핑 테이블 작성
아래 형식으로 매핑 테이블을 작성해주세요:

```
이미지번호 | 이미지설명 | JSON ID | 이모지 | 수리비평균
---------|----------|---------|--------|----------
1        | 자동하이빔 | ??? | 🌫️🔦 | 80,000원
2        | 파워스티어링 | power-steering | 🛞⚠️ | 380,000원
...
```

---

## 🎯 확인 방법

### 이미지 다시 보기
위에 첨부하신 64개 경고등 이미지를 참고하세요.

### 현재 JSON ID 목록
```bash
# 전체 목록 보기
node -e "require('./lib/car-warning-lights-data.json').warningLights.forEach((l,i) => console.log((i+1) + '. ' + l.id + ' - ' + l.name))"

# 특정 키워드 검색
node -e "require('./lib/car-warning-lights-data.json').warningLights.filter(l => l.name.includes('스티어링')).forEach(l => console.log(l.id, '-', l.name))"
```

---

## ⚠️ 문제점

GPT-5가 제공한 ID들 (front-fog-lamp, steering-fault 등)이 실제 JSON의 ID (oil-pressure, battery-charge 등)와 다릅니다.

**해결 방법:**
1. 이미지 번호와 현재 JSON의 경고등을 직접 매칭
2. 또는 GPT-5에게 현재 JSON의 실제 ID 목록을 보여주고 다시 매핑 요청

---

## 📝 다음 단계

**옵션 A: 수동 매핑**
- CURRENT_WARNING_LIGHTS_LIST.md를 열어서 확인
- 이미지와 하나씩 비교하며 매핑

**옵션 B: GPT-5 재요청**
- 현재 JSON의 실제 69개 ID 목록 제공
- "이 ID들을 사용하여 이미지 번호와 매칭해주세요" 요청

어떤 방법을 선호하시나요?




































