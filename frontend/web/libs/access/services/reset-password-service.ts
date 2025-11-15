import 'server-only'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { ResetPasswordRequest, resetPasswordRequestSchema } from '../models/reset-password-request';
import prisma from '@/libs/_general/managers/database-manager';
import { string } from 'zod';
import { MessageContent } from '@/libs/_general/enums/message';
import { UserWithRole } from '@/libs/user/models/user-dao';
import { getSessionPayloadFromUserRole } from '../managers/session-manager';
import { issueToken } from '@/libs/_general/managers/jwt-manager';

export const resetPasswordService = tryCatch(async (
  request: ResetPasswordRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = resetPasswordRequestSchema.parse(request);

  const user = await getUser(parsedRequest.email);
  if (!user) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '用戶'),
  }

  const token = await createToken(user)

  await sendEmail(user, token)

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

const createToken = async (user: UserWithRole): Promise<string> => {
  const payload = getSessionPayloadFromUserRole(user)
  return await issueToken(payload, '15m')
}

const sendEmail = async (user: UserWithRole, token: string) => {

  // send update password email
  // with link url param: ?token=JWT_TOKEN
}