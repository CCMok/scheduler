import 'server-only'
import { UserExcludePasswordWithRole } from "@/libs/user/models/user-dao";
import { sendEmail } from "@/libs/_general/managers/email-manager";
import RegisterVerificationEmail, { EMAIL_SUBJECT } from "@/emails/register-verification-email";
import { getSessionPayloadFromUserRole } from "../managers/session-manager";
import { issueToken } from "@/libs/_general/managers/jwt-manager";
import { VERIFY_EMAIL_TOKEN_EXPIRATION_TIME } from "../constants/token-constant";
import { BASE_URL } from "@/libs/_general/constants/url-constant";
import { PATH } from "@/libs/_general/enums/path";

export const sendVerificationEmail = async (user: UserExcludePasswordWithRole): Promise<boolean> => {
  const verifyEmailUrl = await createVerifyEmailUrl(user);

  return await sendEmail(
    user.email,
    EMAIL_SUBJECT,
    RegisterVerificationEmail({
      userName: user.name || user.email,
      verifyResultUrl: verifyEmailUrl,
    }),
  )
}

const createVerifyEmailUrl = async (user: UserExcludePasswordWithRole): Promise<string> => {
  const payload = getSessionPayloadFromUserRole(user)
  const token = await issueToken(payload, VERIFY_EMAIL_TOKEN_EXPIRATION_TIME)
  return `${BASE_URL}${PATH.verifyEmail.result(token)}`
}