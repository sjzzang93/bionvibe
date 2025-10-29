/**
 * 인분 기준 손익분기 계산 로직 수동 테스트
 */

// calc 함수를 수동으로 재구현 (테스트용)
function calc(inputs) {
  const {
    P,
    M,
    g,
    B,
    s_sold,
    s_free,
    L,
    V_misc,
    D_profit,
    fixedMonth,
    goalProfitDay,
    targetTables,
  } = inputs

  // 유효성 검증
  if (g <= 0 || s_sold <= 0) {
    throw new Error("g(그램), s_sold(유상 인분)은 0보다 커야 합니다.")
  }
  if (P < 0 || M < 0 || B < 0 || V_misc < 0) {
    throw new Error("금액형 입력은 음수가 될 수 없습니다.")
  }
  if (L < 0 || L >= 1) {
    throw new Error("로스율 L은 0 이상 1 미만이어야 합니다.")
  }

  // 계산
  const C = M * (g / 1000) + B
  const consumed = s_sold * (1 + L) + s_free
  const revTable = s_sold * P
  const costTable = consumed * C
  const CM_table = revTable - costTable - V_misc + D_profit

  if (CM_table <= 0) {
    throw new Error(
      "테이블 기여이익(CM_table)이 0 이하입니다. 가격·원가·로스·부자재를 재점검하세요."
    )
  }

  const fixedDay = fixedMonth / 30
  const beTables = (fixedDay + goalProfitDay) / CM_table
  const beSalesDay = beTables * revTable

  let P_required = undefined
  if (targetTables && targetTables > 0) {
    P_required =
      ((fixedDay + goalProfitDay) / targetTables +
        consumed * C +
        V_misc -
        D_profit) /
      s_sold
  }

  return {
    C,
    consumed,
    revTable,
    costTable,
    CM_table,
    fixedDay,
    beTables,
    beSalesDay,
    P_required,
  }
}

// 테스트 케이스 A: 대표님 샘플
function testCaseA() {
  console.log("=== Test Case A: 대표님 샘플 ===")

  const inputs = {
    P: 16000,
    M: 11500,
    g: 200,
    B: 1200,
    s_sold: 3.5,
    s_free: 0.2,
    L: 0.10,
    V_misc: 1000,
    D_profit: 3000,
    fixedMonth: 12000000,
    goalProfitDay: 0,
    targetTables: 10,
  }

  const outputs = calc(inputs)

  console.log("\n출력:")
  console.log(outputs)

  // 기대값
  const expected = {
    C: 3500,
    consumed: 4.05,
    revTable: 56000,
    costTable: 14175,
    CM_table: 43825,
    fixedDay: 400000,
    beTables: 9.13,
    beSalesDay: 511280,
    P_required: 14907,
  }

  console.log("\n기대값:")
  console.log(expected)

  console.log("\n검증:")
  console.log("C:", outputs.C === expected.C ? "✓" : `✗ (실제: ${outputs.C})`)
  console.log("consumed:", outputs.consumed.toFixed(2) === expected.consumed.toFixed(2) ? "✓" : `✗ (실제: ${outputs.consumed})`)
  console.log("revTable:", outputs.revTable === expected.revTable ? "✓" : `✗ (실제: ${outputs.revTable})`)
  console.log("costTable:", outputs.costTable === expected.costTable ? "✓" : `✗ (실제: ${outputs.costTable})`)
  console.log("CM_table:", outputs.CM_table === expected.CM_table ? "✓" : `✗ (실제: ${outputs.CM_table})`)
  console.log("fixedDay:", outputs.fixedDay === expected.fixedDay ? "✓" : `✗ (실제: ${outputs.fixedDay})`)
  console.log("beTables:", Math.abs(outputs.beTables - expected.beTables) < 0.01 ? "✓" : `✗ (실제: ${outputs.beTables.toFixed(2)})`)
  console.log("beSalesDay:", Math.abs(outputs.beSalesDay - expected.beSalesDay) < 100 ? "✓" : `✗ (실제: ${outputs.beSalesDay.toFixed(0)})`)
  console.log("P_required:", outputs.P_required && Math.abs(outputs.P_required - expected.P_required) < 10 ? "✓" : `✗ (실제: ${outputs.P_required?.toFixed(0)})`)
}

// 테스트 케이스 B: 로스율 0%
function testCaseB() {
  console.log("\n\n=== Test Case B: 로스율 0% ===")

  const inputs = {
    P: 16000,
    M: 11500,
    g: 200,
    B: 1200,
    s_sold: 3.5,
    s_free: 0.2,
    L: 0, // 로스율 0%
    V_misc: 1000,
    D_profit: 3000,
    fixedMonth: 12000000,
    goalProfitDay: 0,
  }

  const outputs = calc(inputs)

  console.log("\n출력:")
  console.log(outputs)

  console.log("\n검증:")
  console.log("consumed:", outputs.consumed === 3.7 ? "✓" : `✗ (실제: ${outputs.consumed})`)
  console.log("beTables가 Case A(9.13)보다 작음:", outputs.beTables < 9.13 ? "✓" : `✗ (실제: ${outputs.beTables.toFixed(2)})`)
}

// 테스트 케이스 C: CM_table <= 0 에러
function testCaseC() {
  console.log("\n\n=== Test Case C: CM_table <= 0 에러 ===")

  const inputs = {
    P: 12000, // 판매가 낮춤
    M: 11500,
    g: 200,
    B: 1200,
    s_sold: 3.5,
    s_free: 0.2,
    L: 0.15, // 로스율 올림
    V_misc: 1000,
    D_profit: 3000,
    fixedMonth: 12000000,
    goalProfitDay: 0,
  }

  try {
    const outputs = calc(inputs)
    console.log("\n출력:")
    console.log(outputs)
    console.log("\n검증: ✗ (에러가 발생해야 하는데 성공함)")
  } catch (e) {
    console.log("\n에러 발생:")
    console.log(e.message)
    console.log("\n검증:", e.message.includes("테이블 기여이익") ? "✓" : "✗")
  }
}

// 모든 테스트 실행
console.log("인분 기준 손익분기 계산 로직 테스트\n")
testCaseA()
testCaseB()
testCaseC()

console.log("\n\n=== 테스트 완료 ===")
