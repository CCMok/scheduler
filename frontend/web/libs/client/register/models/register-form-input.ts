import { ClientMessageContent } from "@/libs/client/_general/enums/client-message-enum";
import { z } from "zod";

export const registerFormInputSchema = z.object({
  email: z.string().min(1, ClientMessageContent.REQUIRED).email(
    ClientMessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: z.string().min(1, ClientMessageContent.REQUIRED),
  confirmPassword: z.string().min(1, ClientMessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: ClientMessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type RegisterFormInput = z.infer<typeof registerFormInputSchema>