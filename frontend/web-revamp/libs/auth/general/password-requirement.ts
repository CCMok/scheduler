type PasswordRequirement = {
  label: string;
  test: (value: string) => boolean;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: '最少8個字元', test: (value: string) => value.length >= 8 },
  { label: '大寫字母', test: (value: string) => /[A-Z]/.test(value) },
  { label: '小寫字母', test: (value: string) => /[a-z]/.test(value) },
  { label: '數字', test: (value: string) => /\d/.test(value) },
  { label: '特殊字符 (@$!%*?&)', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]