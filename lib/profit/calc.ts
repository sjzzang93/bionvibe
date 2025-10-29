/**
 * 인분 기준 손익분기 계산 로직
 *
 * 계산 근거:
 * 1. C = M * (g/1000) + B (원가/인분)
 * 2. consumed = s_sold * (1 + L) + s_free (실제 소비 인분)
 * 3. revTable = s_sold * P (테이블 매출)
 * 4. costTable = consumed * C (테이블 원가)
 * 5. CM_table = revTable - costTable - V_misc + D_profit (테이블 기여이익)
 * 6. fixedDay = fixedMonth / 30 (하루 고정비)
 * 7. beTables = (fixedDay + goalProfitDay) / CM_table (손익분기 테이블 수)
 * 8. beSalesDay = beTables * revTable (손익분기 하루 매출)
 * 9. P_required = ((fixedDay + goalProfitDay)/targetTables + consumed * C + V_misc - D_profit) / s_sold
 */

import { Inputs, Outputs } from "./types"

export function calc(inputs: Inputs): Outputs {
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

  let P_required: number | undefined = undefined
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
