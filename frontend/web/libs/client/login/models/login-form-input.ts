import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";
import { z } from "zod";

export const loginFormInputSchema = z.object({
  email: z.string().min(1, UiMessageContent.REQUIRED).email(
    UiMessageContent.FORMAT_NOT_VALID.replaceAll("{0}", "電郵地址")
  ),
  password: z.string().min(1, UiMessageContent.REQUIRED),
})

export type LoginFormInput = z.infer<typeof loginFormInputSchema>