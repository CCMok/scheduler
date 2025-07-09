import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/server/login/models/login-request'
import { ServerResponse } from '@/libs/share/_general/models/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { ServerMessage } from '../../_general/enums/server-message';
import { compare } from '../../_general/managers/bcrypt-manager';
import { UserRole } from '../../user/models/user-models';
import { setSession } from '../../_general/managers/session-manager';
import prisma from '../../_general/managers/database-manager';

export const login = async (request: LoginRequest): Promise<ServerResponse> => {
  const parsedRequest = loginRequestSchema.parse(request);

  const userRole = await checkLoginInfo(parsedRequest)
  if (!userRole) return {
    status: ServerResponseStatus.BAD_REQUEST,
    message: ServerMessage.INCORRECT.replaceAll('{0}', '電郵地址或密碼'),
  }

  await setSession(userRole)

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

const checkLoginInfo = async (request: LoginRequest): Promise<UserRole | undefined> => {
  const userRole = await findUser(request.email)

  if (!userRole) {
    return
  }

  const samePassword = await compare(request.password, userRole.password)
  if (!samePassword) {
    return
  }

  return userRole;
}

const findUser = async (email: string) => (
  await prisma.user.findUnique({
    where: { email },
    include: {
      role: true,
    },
  })
)