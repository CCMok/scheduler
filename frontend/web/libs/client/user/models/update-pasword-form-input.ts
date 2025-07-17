import { ClientMessageContent } from "@/libs/client/_general/enums/client-message-enum";
import { z } from "zod";
import { newPasswordInputSchema } from "./new-password";

export const updatePasswordFormInputSchema = z.object({
  password: newPasswordInputSchema,
  confirmPassword: z.string().min(1, ClientMessageContent.REQUIRED),
}).refine(value => value.password === value.confirmPassword, {
  message: ClientMessageContent.MATCH.replaceAll("{0}", "密碼"),
  path: ["confirmPassword"],
})

export type UpdatePasswordFormInput = z.infer<typeof updatePasswordFormInputSchema>