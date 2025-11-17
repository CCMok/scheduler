import { z } from "zod";
import { MessageContent } from "@/libs/_general/enums/message";
import { newPasswordFormInputSchema } from "@/libs/user/models/new-password-form-input";

export enum UpdatePasswordFormInputKey {
  PASSWORD = 'password',
  CONFIRM_PASSWORD = 'confirmPassword',
}

export const updatePasswordFormInputSchema = z.object({
  [UpdatePasswordFormInputKey.PASSWORD]: newPasswordFormInputSchema,
  [UpdatePasswordFormInputKey.CONFIRM_PASSWORD]: z.string().min(1, MessageContent.REQUIRED),
}).refine(value => value[UpdatePasswordFormInputKey.PASSWORD] === value[UpdatePasswordFormInputKey.CONFIRM_PASSWORD], {
  message: MessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: [UpdatePasswordFormInputKey.CONFIRM_PASSWORD],
})

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormInputSchema>