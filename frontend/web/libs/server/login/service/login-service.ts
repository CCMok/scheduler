import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/share/login/model/login-request'
import { ServerResponse } from '@/libs/share/_general/model/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { findUserByEmail } from '../../user/repositories/user-repository';
import { ServerMessage } from '../../_general/enums/server-message';
import { compare } from '../../_general/manager/bcrypt-manager';
import { UserRole } from '../../user/models/user-models';
import { setSession } from '../../_general/manager/session-manager';

export const login = async (request: LoginRequest): Promise<ServerResponse> => {
  const requestValid = checkRequest(request);
  if (!requestValid) {
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

const checkRequest = (request: LoginRequest): boolean => {
  const result = loginRequestSchema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result.success;
}

const checkLoginInfo = async (request: LoginRequest): Promise<UserRole | undefined> => {
  const userRole = await findUserByEmail(request.email, true)

  if (!userRole) {
    return
  }

  const samePassword = await compare(request.password, userRole.password)
  if (!samePassword) {
    return
  }

  return userRole;
}