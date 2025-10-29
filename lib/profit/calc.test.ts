/**
 * 인분 기준 손익분기 계산 로직 테스트
 */

import { calc } from "./calc"
import type { Inputs } from "./types"

// 테스트 케이스 A: 대표님 샘플
function testCaseA() {
  console.log("=== Test Case A: 대표님 샘플 ===")

  const inputs: Inputs = {
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

  console.log("입력:")
  console.log(inputs)
  console.log("\n출력:")
  console.log(outputs)

  // 기대값 검증
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
  console.log("consumed:", outputs.consumed === expected.consumed ? "✓" : `✗ (실제: ${outputs.consumed})`)
  console.log("revTable:", outputs.revTable === expected.revTable ? "✓" : `✗ (실제: ${outputs.revTable})`)
  console.log("costTable:", outputs.costTable === expected.costTable ? "✓" : `✗ (실제: ${outputs.costTable})`)
  console.log("CM_table:", outputs.CM_table === expected.CM_table ? "✓" : `✗ (실제: ${outputs.CM_table})`)
  console.log("fixedDay:", outputs.fixedDay === expected.fixedDay ? "✓" : `✗ (실제: ${outputs.fixedDay})`)
  console.log("beTables:", Math.abs(outputs.beTables - expected.beTables) < 0.01 ? "✓" : `✗ (실제: ${outputs.beTables})`)
  console.log("beSalesDay:", Math.abs(outputs.beSalesDay - expected.beSalesDay) < 1 ? "✓" : `✗ (실제: ${outputs.beSalesDay})`)
  console.log("P_required:", outputs.P_required && Math.abs(outputs.P_required - expected.P_required) < 1 ? "✓" : `✗ (실제: ${outputs.P_required})`)
}

// 테스트 케이스 B: 로스율 0%
function testCaseB() {
  console.log("\n\n=== Test Case B: 로스율 0% ===")

  const inputs: Inputs = {
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

  console.log("입력:")
  console.log(inputs)
  console.log("\n출력:")
  console.log(outputs)

  // 로스율이 0이면 consumed = 3.5 + 0.2 = 3.7
  // CM_table이 증가하므로 beTables는 감소해야 함
  console.log("\n검증:")
  console.log("consumed:", outputs.consumed === 3.7 ? "✓" : `✗ (실제: ${outputs.consumed})`)
  console.log("beTables가 Case A보다 작음:", outputs.beTables < 9.13 ? "✓" : "✗")
}

// 테스트 케이스 C: CM_table <= 0 에러
function testCaseC() {
  console.log("\n\n=== Test Case C: CM_table <= 0 에러 ===")

  const inputs: Inputs = {
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

  console.log("입력:")
  console.log(inputs)

  try {
    const outputs = calc(inputs)
    console.log("\n출력:")
    console.log(outputs)
    console.log("\n검증: ✗ (에러가 발생해야 하는데 성공함)")
  } catch (e: any) {
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
