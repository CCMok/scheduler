import { MessageContent } from "@/libs/server/_general/enums/message";
import { z } from "zod";

export const loginFormInputSchema = z.object({
  email: z.string().min(1, MessageContent.REQUIRED).email(
    MessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: z.string().min(1, MessageContent.REQUIRED),
})

export type LoginFormInput = z.infer<typeof loginFormInputSchema>