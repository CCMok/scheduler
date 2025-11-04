import { z } from "zod";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_VERIFY_REGEX } from "../../user/constants/password-constant";
import { MessageContent } from "@/libs/_general/enums/message";

export const newPasswordFormInputSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, MessageContent.PASSWORD_STRENGTH_NOT_ENOUGH)
  .max(PASSWORD_MAX_LENGTH, MessageContent.MAX_LENGTH.replaceAll("{0}", PASSWORD_MAX_LENGTH.toString()))
  .regex(PASSWORD_VERIFY_REGEX, MessageContent.PASSWORD_STRENGTH_NOT_ENOUGH)