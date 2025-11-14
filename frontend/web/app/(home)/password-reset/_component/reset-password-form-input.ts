import { MessageContent } from "@/libs/_general/enums/message";
import { z } from "zod";

export enum ResetPasswordFormInputKey {
  EMAIL = 'email',
}

export const resetPasswordFormInputSchema = z.object({
  [ResetPasswordFormInputKey.EMAIL]: z.string().min(1, MessageContent.REQUIRED).email(
    MessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
})

export type ResetPasswordFormInput = z.infer<typeof resetPasswordFormInputSchema>