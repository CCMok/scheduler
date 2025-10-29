import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/server/login/models/login-request'
import { ServiceResponse } from '@/libs/share/_general/models/service-response'
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { UserRole } from '../../user/models/user-dao';
import { setSession } from '../../_general/managers/session-manager';
import prisma from '../../_general/managers/database-manager';
import { compare } from 'bcryptjs';
import { serviceWrapper } from '../../_general/services/general-service';

export const loginService = async (request: LoginRequest): Promise<ServiceResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = loginRequestSchema.parse(request);

    const userRole = await checkLoginInfo(parsedRequest)
    if (!userRole) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.INCORRECT.replaceAll('{0}', '電郵地址或密碼'),
    }

    await setSession(userRole)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })


const checkLoginInfo = async (request: LoginRequest): Promise<UserRole | undefined> => {
  const userRole = await getUser(request.email)

  if (!userRole) {
    return
  }

  const samePassword = await compare(request.password, userRole.password)
  if (!samePassword) {
    return
  }

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