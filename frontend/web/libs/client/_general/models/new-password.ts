import { ClientMessageContent } from "@/libs/client/_general/enums/client-message-enum";
import { z } from "zod";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_VERIFY_REGEX } from "../../password/constants/password-constant";

export const newPasswordInputSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, ClientMessageContent.PASSWORD_STRENGTH_NOT_ENOUGH)
  .max(PASSWORD_MAX_LENGTH, ClientMessageContent.MAX_LENGTH.replaceAll("{0}", PASSWORD_MAX_LENGTH.toString()))
  .regex(PASSWORD_VERIFY_REGEX, ClientMessageContent.PASSWORD_STRENGTH_NOT_ENOUGH)

export type NewPasswordInput = z.infer<typeof newPasswordInputSchema>