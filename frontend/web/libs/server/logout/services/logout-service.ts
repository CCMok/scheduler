import 'server-only'
import { deleteSession } from '../../_general/managers/session-manager'
import { ServerResponse } from '@/libs/share/_general/models/server-response';
import { ServerResponseStatus } from '../../_general/enums/server-response-status';

export const logout = async (): Promise<ServerResponse> => {
  await deleteSession();

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}