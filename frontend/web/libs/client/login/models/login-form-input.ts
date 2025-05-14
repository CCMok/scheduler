import { Message } from "@/libs/share/_general/enums/message";
import { z } from "zod";

export const loginFormInputSchema = z.object({
  email: z.string().email(Message.EMAIL_FORMAT_NOT_VALID),
  password: z.string().min(1, Message.REQUIRED),
})

export type LoginFormInput = z.infer<typeof loginFormInputSchema>