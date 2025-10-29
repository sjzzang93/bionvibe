/**
 * 인분 기준 손익분기 계산기 타입 정의
 *
 * 도메인 용어:
 * P = 판매가/인분 (원)
 * M = 원육 단가/kg (원/kg)
 * g = 1인분 그램수(g)
 * B = 부자재/인분 원가(원) (쌈·반찬·소스·숯 일부 등)
 * s_sold = 테이블당 유상 판매 인분 수(인분)
 * s_free = 테이블당 서비스 인분 수(인분)
 * L = 로스율(0~1) (손실/폐기/시식 포함)
 * V_misc = 기타 변동비/테이블(원) (숯·가스·물티슈 등)
 * D_profit = 음료·주류 순이익/테이블(원)
 * fixedMonth = 월 고정비(원)
 * goalProfitDay = 하루 목표이익(원)
 */

export interface Inputs {
  /** 판매가/인분 (원) */
  P: number
  /** 원육 단가/kg (원/kg) */
  M: number
  /** 1인분 그램수(g) */
  g: number
  /** 부자재/인분 원가(원) */
  B: number
  /** 테이블당 유상 판매 인분 수 */
  s_sold: number
  /** 테이블당 서비스 인분 수 */
  s_free: number
  /** 로스율 (0~1) */
  L: number
  /** 기타 변동비/테이블(원) */
  V_misc: number
  /** 음료·주류 순이익/테이블(원) */
  D_profit: number
  /** 월 고정비(원) */
  fixedMonth: number
  /** 하루 목표이익(원) */
  goalProfitDay: number
  /** 목표 테이블 수 (역산 판매가 계산용, 선택) */
  targetTables?: number
}

export interface Outputs {
  /** 원가/인분 (원) */
  C: number
  /** 소비 인분 (실제 소비량) */
  consumed: number
  /** 테이블 매출 (원) */
  revTable: number
  /** 테이블 원가 (원) */
  costTable: number
  /** 테이블 기여이익 (원) */
  CM_table: number
  /** 하루 고정비 (원) */
  fixedDay: number
  /** 손익분기 테이블 수 */
  beTables: number
  /** 손익분기 하루 매출 (원) */
  beSalesDay: number
  /** 목표 테이블 달성 위한 필요 판매가/인분 (원, 선택) */
  P_required?: number
}
