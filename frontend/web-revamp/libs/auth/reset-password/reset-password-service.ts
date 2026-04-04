import 'server-only'
import { ServiceResponse } from "@/libs/_general/service/response";
import { tryCatch } from '@/libs/_general/service/try-catch';
import { ResetPasswordRequest, resetPasswordRequestSchema } from './reset-password-request';
import prisma from '@/libs/_general/database/database-manager';
import { Message } from '@/libs/_general/service/message';
import { BASE_URL, createToken } from '@/libs/_general/session/email-session-utils';
import { User } from '@/external/prisma/generated/client';
import { ROUTE } from '@/libs/_general/route/route-config';
import { sendEmail } from '@/libs/_general/email/email-manager';
import ResetPasswordVerificationEmail, { EMAIL_SUBJECT } from '@/emails/reset-password-verification-email';

export const resetPassword = tryCatch(async (request: ResetPasswordRequest): Promise<ServiceResponse> => {
  const parsedRequest = resetPasswordRequestSchema.parse(request)

  const user = await getUserByEmail(parsedRequest.email)
  if (!user) return {
    isSuccess: false,
    message: Message.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  const emailSent = await sendVerificationEmail(user)
  if (!emailSent) return {
    isSuccess: false,
    message: Message.SYSTEM_ERROR,
  }

  return {
    isSuccess: true,
  }
})

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  })
}

const sendVerificationEmail = async (user: User): Promise<boolean> => {
  const token = await createToken(user)
  const verifyUrl = `${BASE_URL}${ROUTE.public.resetPassword.verification.token(token)}`;
  return await sendEmail(
    user.email,
    EMAIL_SUBJECT,
    ResetPasswordVerificationEmail({
      userName: user.name || user.email,
      verifyUrl,
    }),
  )
}