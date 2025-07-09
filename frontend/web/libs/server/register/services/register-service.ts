import 'server-only'
import { ServerResponse } from '@/libs/share/_general/models/server-response'
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { RegisterRequest } from '../models/register-request';

export const register = async (request: RegisterRequest): Promise<ServerResponse> => {
  // TODO
  console.log('call register service')
  return {
    status: ServerResponseStatus.INTERNAL_ERROR,
    data: {},
  }
}