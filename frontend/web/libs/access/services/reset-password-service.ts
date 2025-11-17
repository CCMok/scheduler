import 'server-only'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { ResetPasswordRequest, resetPasswordRequestSchema } from '../models/reset-password-request';
import prisma from '@/libs/_general/managers/database-manager';
import { MessageContent } from '@/libs/_general/enums/message';
import { UserExcludePasswordWithRole, UserWithRole } from '@/libs/user/models/user-dao';
import { getSessionPayloadFromUserRole } from '../managers/session-manager';
import { issueToken } from '@/libs/_general/managers/jwt-manager';
import { PATH } from '@/libs/_general/enums/path';
import ResetPasswordEmail, { EMAIL_SUBJECT } from '@/emails/reset-password-email';
import { sendEmail } from '@/libs/_general/managers/email-manager';
import { BASE_URL } from '@/libs/_general/constants/url-constant';
import { ReactNode } from 'react';
import { RESET_PASSWORD_TOKEN_EXPIRATION_TIME } from '../constants/token-constant';

export const resetPasswordService = tryCatch(async (
  request: ResetPasswordRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = resetPasswordRequestSchema.parse(request);

  const user = await getUser(parsedRequest.email);
  if (!user) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  const emailContent = await createEmailContent(user);

  const emailSent = await sendEmail(
    user.email,
    EMAIL_SUBJECT,
    emailContent,
  )

  if (!emailSent) return {
    status: ServiceResponseStatus.INTERNAL_ERROR,
  }

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const getUser = async (email: string) => (
  await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  })
)

const createEmailContent = async (user: UserExcludePasswordWithRole): Promise<ReactNode> => {
  const updatePasswordUrl = await createUpdatePasswordUrl(user);
  return ResetPasswordEmail({ userName: user.name || user.email, updatePasswordUrl });
}

const createUpdatePasswordUrl = async (user: UserExcludePasswordWithRole): Promise<string> => {
  const payload = getSessionPayloadFromUserRole(user)
  const token = await issueToken(payload, RESET_PASSWORD_TOKEN_EXPIRATION_TIME)
  return `${BASE_URL}${PATH.updatePassword}/${token}`
}