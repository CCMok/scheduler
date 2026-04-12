import { PASSWORD_REQUIREMENTS } from "@/libs/auth/general/password-requirement";
import { z } from "zod";

export const FORM_ID = 'update-password-form';

export enum FORM_FIELD {
  CURRENT_PASSWORD = 'currentPassword',
  NEW_PASSWORD = 'newPassword',
  CONFIRM_PASSWORD = 'confirmPassword',
}

export const formSchema = z.object({
  [FORM_FIELD.CURRENT_PASSWORD]: z.string(),
  [FORM_FIELD.NEW_PASSWORD]: z.string(),
  [FORM_FIELD.CONFIRM_PASSWORD]: z.string(),
}).refine((data) => data[FORM_FIELD.CURRENT_PASSWORD] !== data[FORM_FIELD.NEW_PASSWORD], {
  error: '舊密碼與新密碼不能相同',
  path: [FORM_FIELD.CURRENT_PASSWORD],
}).refine((data) => data[FORM_FIELD.NEW_PASSWORD] === data[FORM_FIELD.CONFIRM_PASSWORD], {
  error: '確認密碼不一致',
  path: [FORM_FIELD.CONFIRM_PASSWORD],
}).refine((data) => PASSWORD_REQUIREMENTS.every(r => r.test(data[FORM_FIELD.NEW_PASSWORD])), {
  path: [FORM_FIELD.NEW_PASSWORD],
})