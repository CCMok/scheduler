export enum MessageTitle {
  SUCCESS = '成功',
  UNAUTHORIZED = '未授權執行操作',
  INPUT_ERROR = '輸入錯誤',
  INTERNAL_ERROR = '系統錯誤',
}

export enum MessageContent {
  FOUND = '{0}已存在',
  NOT_FOUND = '{0}不存在',
  ALREADY_USED = '{0}已被使用',
  MATCH = '必須與{0}相同',
  NOT_MATCH = '必須與{0}不同',
  INCORRECT = '{0}錯誤',
  REQUIRED = '必須填寫',
  FORMAT_NOT_VALID = '請輸入有效的{0}',
  PASSWORD_STRENGTH_NOT_ENOUGH = '密碼強度不足',
  MIN = '請輸入不小於 {0}',
  MAX_LENGTH = '請輸入長度不大於 {0}',
}