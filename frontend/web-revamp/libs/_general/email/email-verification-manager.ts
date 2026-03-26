import 'server-only'
import { User } from "@/external/prisma/generated/client";
import { getSessionPayload } from '../session/session-manager';
import { encrypt } from '../jwt/jwt-manager';
import { sendEmail } from './email-manager';
import SignUpVerificationEmail, { EMAIL_SUBJECT } from '@/emails/sign-up-verification-email';
import { ROUTE } from '../route/route';

const EXPIRATION_TIME = 15 * 60 * 1000

const BASE_URL = (() => {
  if (process.env.SITE_DOMAIN) {
    return `https://${process.env.SITE_DOMAIN}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
})()

export const sendEmailVerification = async (user: User): Promise<boolean> => {
  const payload = getSessionPayload(user)
  const token = await encrypt(payload, EXPIRATION_TIME)
  const verifyUrl = `${BASE_URL}${ROUTE.public.verifyEmail(token)}`;

  return await sendEmail(
    user.email,
    EMAIL_SUBJECT,
    SignUpVerificationEmail({
      userName: user.name || user.email,
      verifyUrl,
    }),
  )
}