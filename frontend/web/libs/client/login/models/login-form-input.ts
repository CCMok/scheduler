import { ClientMessageContent } from "@/libs/client/_general/enums/client-message-enum";
import { z } from "zod";

export const loginFormInputSchema = z.object({
  email: z.string().min(1, ClientMessageContent.REQUIRED).email(
    ClientMessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: z.string().min(1, ClientMessageContent.REQUIRED),
})

export type LoginFormInput = z.infer<typeof loginFormInputSchema>