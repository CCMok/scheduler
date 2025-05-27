import { ClientMessage } from "@/libs/client/_general/enums/client-message";
import { z } from "zod";

export const loginFormInputSchema = z.object({
  email: z.string().min(1, ClientMessage.REQUIRED).email(
    ClientMessage.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: z.string().min(1, ClientMessage.REQUIRED),
})

export type LoginFormInput = z.infer<typeof loginFormInputSchema>