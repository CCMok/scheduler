import { z } from "zod";
import { Message } from "../../_general/enums/message";

export const loginRequestSchema = z.object({
  email: z.string().email(Message.EMAIL_FORMAT_NOT_VALID),
  password: z.string().min(1, Message.REQUIRED),
})

export type LoginRequest = z.infer<typeof loginRequestSchema>