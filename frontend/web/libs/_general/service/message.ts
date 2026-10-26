export enum Message {
  SYSTEM_ERROR = '系統錯誤',
  UNAUTHORIZED = '未授權執行操作',

  REQUIRED = '必須填寫',
  FORMAT_NOT_VALID = '請輸入有效格式',
  INCORRECT = '不正確',
  ALREADY_USED = '{0}已被使用',
  NOT_FOUND = '{0}不存在',
  NOT_VERIFIED = '未驗證',
  NOT_CHANGE = '沒有更改',

  /** Solver could not find any feasible roster (offs / staffing / caps). */
  ROSTER_INFEASIBLE = '無法編排出可行的值班表。請減少休假、增加職位資格，或放寬每表上限後再試。',
  /** Solver engine / unexpected status — not the same as infeasible. */
  ROSTER_SOLVER_ERROR = '自動編排引擎發生錯誤，請稍後再試。',
  /** Soft success: usable roster that is not proven optimal. */
  ROSTER_FEASIBLE_APPROXIMATE = '已編排出可用值班表（近似解，非最優）。可再微調或重新編排。',
}