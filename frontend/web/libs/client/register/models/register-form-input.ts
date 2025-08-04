import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";
import { z } from "zod";
import { newPasswordInputSchema } from "../../user/models/new-password";

export const registerFormInputSchema = z.object({
  email: z.string().min(1, UiMessageContent.REQUIRED).email(
    UiMessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: newPasswordInputSchema,
  confirmPassword: z.string().min(1, UiMessageContent.REQUIRED),
  name: z.string().min(0, UiMessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: UiMessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type RegisterFormInput = z.infer<typeof registerFormInputSchema>