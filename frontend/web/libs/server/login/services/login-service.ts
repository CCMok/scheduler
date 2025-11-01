import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/server/login/models/login-request'
import { UserWithRole } from '../../user/models/user-dao';
import { setSession } from '../../_general/managers/session-manager';
import prisma from '../../_general/managers/database-manager';
import { compare } from 'bcryptjs';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';

export const loginService = tryCatch(async (
  request: LoginRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = loginRequestSchema.parse(request);

  const userRole = await checkLoginInfo(parsedRequest)
  if (!userRole) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.INCORRECT.replaceAll('{0}', '電郵地址或密碼'),
  }

  await setSession(userRole)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
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