import { PASSWORD_REQUIREMENTS } from "@/libs/auth/general/password-requirement";
import { z } from "zod";

export const FORM_ID = 'update-password-form';

export enum FORM_FIELD {
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword',
}

export const formSchema = z.object({
  [FORM_FIELD.PASSWORD]: z.string(),
  [FORM_FIELD.CONFIRM_PASSWORD]: z.string(),
}).refine((data) => data[FORM_FIELD.PASSWORD] === data[FORM_FIELD.CONFIRM_PASSWORD], {
  error: '確認密碼不一致',
  path: [FORM_FIELD.CONFIRM_PASSWORD],
}).refine((data) => PASSWORD_REQUIREMENTS.every(r => r.test(data[FORM_FIELD.PASSWORD])), {
  path: [FORM_FIELD.PASSWORD],
})