import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/server/login/models/login-request'
import { ServerResponse } from '@/libs/share/_general/models/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { findByEmail } from '../../user/repositories/user-repository';
import { ServerMessage } from '../../_general/enums/server-message';
import { compare } from '../../_general/managers/bcrypt-manager';
import { UserRole } from '../../user/models/user-models';
import { setSession } from '../../_general/managers/session-manager';
import { schemaCheck } from '../../_general/utils/schema-check-utils';

export const login = async (request: LoginRequest): Promise<ServerResponse> => {
  const isSchemaCheckSuccess = schemaCheck(loginRequestSchema, request);
  if (!isSchemaCheckSuccess) {
    return {
      status: ServerResponseStatus.BAD_REQUEST,
    }
  }

  const userRole = await checkLoginInfo(request)
  if (!userRole) {
    return {
      status: ServerResponseStatus.BAD_REQUEST,
      message: ServerMessage.EMAIL_OR_PASSWORD_INCORRECT,
    }
  }

  await setSession(userRole)

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}

const checkLoginInfo = async (request: LoginRequest): Promise<UserRole | undefined> => {
  const userRole = await findByEmail(request.email, true)

  if (!userRole) {
    return
  }

  const samePassword = await compare(request.password, userRole.password)
  if (!samePassword) {
    return
  }

  return userRole;
}