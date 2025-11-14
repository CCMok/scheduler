import 'server-only'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { ResetPasswordRequest, resetPasswordRequestSchema } from '../models/reset-password-request';
import prisma from '@/libs/_general/managers/database-manager';

export const resetPasswordService = tryCatch(async (
  request: ResetPasswordRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = resetPasswordRequestSchema.parse(request);

  // check user exists

  // generate token
  // expiration time e.g. 15 min

  // send update password email
  // with link url param: ?token=JWT_TOKEN

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