import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/share/login/model/login-request'
import { ServerResponse } from '@/libs/share/_general/model/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { User } from '@/external/prisma-generated';
import { findUserByEmail } from '../../user/repository/user-repository';
import { ServerMessage } from '../../_general/enums/server-message';
import { compare } from '../../_general/manager/bcrypt-manager';

export const login = async (request: LoginRequest): Promise<ServerResponse> => {
  const requestValid = checkRequest(request);
  if (!requestValid) {
    return {
      status: ServerResponseStatus.BAD_REQUEST,
    }
  }

  const checkLoginInfoResponse = await checkLoginInfo(request)
  if (!checkLoginInfoResponse.success) {
    return {
      status: ServerResponseStatus.BAD_REQUEST,
      message: checkLoginInfoResponse.message,
    }
  }

  // TODO
  // set session

  // redirect

  return {
    status: ServerResponseStatus.INTERNAL_ERROR,
  }
}

const checkRequest = (request: LoginRequest): boolean => {
  const result = loginRequestSchema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result.success;
}

type CheckLoginInfoSuccessResponse = {
  success: true;
  user: User;
}

type CheckLoginInfoFailResponse = {
  success: false;
  message: string;
}

const checkLoginInfo = async (request: LoginRequest): Promise<CheckLoginInfoSuccessResponse | CheckLoginInfoFailResponse> => {
  const user = await findUserByEmail(request.email)
  
  if (!user) {
    return { success: false, message: ServerMessage.EMAIL_OR_PASSWORD_INCORRECT }
  }

  const samePassword = await compare(request.password, user.password)
  if (!samePassword) {
    return { success: false, message: ServerMessage.EMAIL_OR_PASSWORD_INCORRECT }
  }

  return { success: true, user };
}