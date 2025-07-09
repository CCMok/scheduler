import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/server/login/models/login-request'
import { ServerResponse } from '@/libs/share/_general/models/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { ServerMessage } from '../../_general/enums/server-message';
import { compare } from '../../_general/managers/bcrypt-manager';
import { UserRole } from '../../user/models/user-models';
import { setSession } from '../../_general/managers/session-manager';
import { schemaCheck } from '../../_general/utils/schema-check-utils';
import prisma from '../../_general/managers/database-manager';

export const login = async (request: LoginRequest): Promise<ServerResponse> => {
  const isSchemaCheckSuccess = schemaCheck(loginRequestSchema, request);
  if (!isSchemaCheckSuccess) return {
    status: ServerResponseStatus.BAD_REQUEST,
  }

  const userRole = await checkLoginInfo(request)
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