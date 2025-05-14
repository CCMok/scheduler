import { Message } from "@/libs/client/_general/enums/message";
import { z } from "zod";

export const loginFormInputSchema = z.object({
  email: z.string().email(
    Message.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: z.string().min(1, Message.REQUIRED),
})

export type LoginFormInput = z.infer<typeof loginFormInputSchema>