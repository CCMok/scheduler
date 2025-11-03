import { z } from "zod";
import { newPasswordInputSchema } from "../../user/models/new-password";
import { MessageContent } from "@/libs/server/_general/enums/message";

export const registerFormInputSchema = z.object({
  email: z.string().min(1, MessageContent.REQUIRED).email(
    MessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: newPasswordInputSchema,
  confirmPassword: z.string().min(1, MessageContent.REQUIRED),
  name: z.string().min(0, MessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: MessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type RegisterFormInput = z.infer<typeof registerFormInputSchema>