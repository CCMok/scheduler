export enum UiMessageTitle {
  CAUTION = '注意',
  INPUT_ERROR = '輸入錯誤',
  SYSTEM_ERROR = '系統錯誤',
  SUCCESS = '成功',
}

export enum UiMessageContent {
  SYSTEM_ERROR = '系統發生錯誤，請稍後再試。',
  REQUIRED = '必須填寫',
  FORMAT_NOT_VALID = '請輸入有效的{0}',
  INTEGER = '請輸入整數',
  MIN = '請輸入不小於 {0}',
  MAX = '請輸入不大於 {0}',
  MIN_LENGTH = '請輸入長度不小於 {0}',
  MAX_LENGTH = '請輸入長度不大於 {0}',
  MATCH = '必須與{0}相同',
  NOT_MATCH = '必須與{0}不同',
  PASSWORD_STRENGTH_NOT_ENOUGH = '密碼強度不足',
  UNAUTHORIZED = '未獲授權',
}
