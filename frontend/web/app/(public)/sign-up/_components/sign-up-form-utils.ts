import { Message } from "@/libs/_general/service/message";
import { PASSWORD_REQUIREMENTS } from "@/libs/auth/general/password-requirement";
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
}).refine((data) => PASSWORD_REQUIREMENTS.every(r => r.test(data[FORM_FIELD.PASSWORD])), {
  path: [FORM_FIELD.PASSWORD],
})