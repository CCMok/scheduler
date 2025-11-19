import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/access/models/login-request'
import { UserWithRole } from '../../user/models/user-dao';
import { setSession } from '../managers/session-manager';
import prisma from '../../_general/managers/database-manager';
import { compare } from 'bcryptjs';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';
import { LoginResponse } from '../models/login-response';

export const loginService = tryCatch(async (
  request: LoginRequest,
): Promise<ServiceResponse<LoginResponse>> => {
  const parsedRequest = loginRequestSchema.parse(request);

  const user = await checkLoginInfo(parsedRequest)
  if (!user) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.INCORRECT.replaceAll('{0}', '電郵地址或密碼'),
  }

  if (!user.isEmailVerified) return {
    status: ServiceResponseStatus.OK,
    data: {
      userId: user.id,
      isVerified: false,
    },
  }

  await setSession(user)

  return {
    status: ServiceResponseStatus.OK,
    data: {
      userId: user.id,
      isVerified: true,
    },
  }
})

const checkLoginInfo = async (request: LoginRequest): Promise<UserWithRole | undefined> => {
  const userRole = await getUser(request.email)
  if (!userRole) return

  const samePassword = await compare(request.password, userRole.password)
  if (!samePassword) return

  return userRole;
}

const getUser = async (email: string) => (
  await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  })
)