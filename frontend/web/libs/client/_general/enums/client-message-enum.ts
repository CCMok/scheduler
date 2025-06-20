export enum ClientMessageTitle {
  CAUTION = '注意',
  INPUT_ERROR = '輸入錯誤',
  SYSTEM_ERROR = '系統錯誤',
  SUCCESS = '成功',
}

export enum ClientMessageContent {
  SYSTEM_ERROR = '系統發生錯誤，請稍後再試。',
  REQUIRED = '必須填寫',
  FORMAT_NOT_VALID = '請輸入有效的{0}',
  INTEGER = '請輸入整數',
  MIN = '請輸入不小於 {0}',
  MAX = '請輸入不大於 {0}'
}
