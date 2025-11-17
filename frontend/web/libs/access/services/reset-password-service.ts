import 'server-only'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { ResetPasswordRequest, resetPasswordRequestSchema } from '../models/reset-password-request';
import prisma from '@/libs/_general/managers/database-manager';
import { MessageContent } from '@/libs/_general/enums/message';
import { UserWithRole } from '@/libs/user/models/user-dao';
import { getSessionPayloadFromUserRole } from '../managers/session-manager';
import { issueToken } from '@/libs/_general/managers/jwt-manager';
import { PATH } from '@/libs/_general/enums/path';
import { Param } from '@/libs/_general/enums/param';
import { Resend } from 'resend';
import ResetPasswordEmail, { EMAIL_SUBJECT } from '@/emails/reset-password-email';

// TODO: create a email manager
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

const FROM_EMAIL_ADDRESS = `notify@${process.env.EMAIL_DOMAIN || 'resend.dev'}`;

const resend = new Resend(process.env.RESEND_API_KEY);

export const resetPasswordService = tryCatch(async (
  request: ResetPasswordRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = resetPasswordRequestSchema.parse(request);

  const user = await getUser(parsedRequest.email);
  if (!user) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  const updatePasswordUrl = await createUpdatePasswordUrl(user);

  const emailSent = await sendEmail(user.email, user.name ?? user.email, updatePasswordUrl);
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

const createUpdatePasswordUrl = async (user: UserWithRole): Promise<string> => {
  const payload = getSessionPayloadFromUserRole(user)
  const token = await issueToken(payload, '15m')
  return `${BASE_URL}${PATH.updatePassword}?${Param.TOKEN}=${token}`
}

const sendEmail = async (userEmail: string, userName: string, updatePasswordUrl: string): Promise<boolean> => {
  const { data, error } = await resend.emails.send({
    from: `Scheduler <${FROM_EMAIL_ADDRESS}>`,
    to: [userEmail],
    subject: EMAIL_SUBJECT,
    react: ResetPasswordEmail({ userName, updatePasswordUrl }),
  });

  if (error) {
    console.error('Send reset password email failed. Error: ', error)
    return false;
  }

  console.log('Sent reset password email. Email id:', data.id)

  return true;
}