import { Message } from "@/libs/_general/service/message";
import { z } from "zod";

export const FORM_ID = 'sign-up-form';

export enum FORM_FIELD {
  EMAIL = 'email',
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword',
  NAME = 'name',
}

export const formSchema = z.object({
  [FORM_FIELD.EMAIL]: z.email(Message.FORMAT_NOT_VALID),
  [FORM_FIELD.PASSWORD]: z.string(),
  [FORM_FIELD.CONFIRM_PASSWORD]: z.string(),
  [FORM_FIELD.NAME]: z.string(),
}).refine((data) => data[FORM_FIELD.PASSWORD] === data[FORM_FIELD.CONFIRM_PASSWORD], {
  error: '確認密碼不一致',
  path: [FORM_FIELD.CONFIRM_PASSWORD],
}).refine((data) => passwordHints.every(hint => hint.test(data[FORM_FIELD.PASSWORD])), {
  path: [FORM_FIELD.PASSWORD],
})

export const passwordHints = [
  { label: '最少8個字元', test: (value: string) => value.length >= 8 },
  { label: '大寫字母', test: (value: string) => /[A-Z]/.test(value) },
  { label: '小寫字母', test: (value: string) => /[a-z]/.test(value) },
  { label: '數字', test: (value: string) => /\d/.test(value) },
  { label: '特殊字符 (@$!%*?&)', test: (value: string) => /[^A-Za-z0-9]/.test(value) },
]