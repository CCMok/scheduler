import 'server-only'
import { deleteSession } from '../../_general/manager/session-manager'
import { ServerResponse } from '@/libs/share/_general/model/server-response';
import { ServerResponseStatus } from '../../_general/enums/server-response-status';

export const logout = async (): Promise<ServerResponse> => {
  await deleteSession();

  return {
    status: ServerResponseStatus.OK,
    data: {},
  }
}