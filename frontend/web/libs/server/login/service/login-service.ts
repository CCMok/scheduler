import 'server-only'
import { LoginRequest, loginRequestSchema } from '@/libs/share/login/model/login-request'
import { ServerResponse } from '@/libs/share/_general/model/server-response'
import { ServerResponseStatus } from '@/libs/share/_general/enums/server-response-status';

export const login = async (request: LoginRequest): Promise<ServerResponse> => {
  const requestValid = checkRequest(request);
  if (!requestValid) {
    return {
      status: ServerResponseStatus.BAD_REQUEST,
    }
  }

  // TODO
  // check eamil and password

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