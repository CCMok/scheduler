import { UiMessageContent } from "@/libs/share/_general/enums/ui-message";
import { z } from "zod";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_VERIFY_REGEX } from "../../user/constants/password-constant";

export const newPasswordInputSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, UiMessageContent.PASSWORD_STRENGTH_NOT_ENOUGH)
  .max(PASSWORD_MAX_LENGTH, UiMessageContent.MAX_LENGTH.replaceAll("{0}", PASSWORD_MAX_LENGTH.toString()))
  .regex(PASSWORD_VERIFY_REGEX, UiMessageContent.PASSWORD_STRENGTH_NOT_ENOUGH)

export type NewPasswordInput = z.infer<typeof newPasswordInputSchema>