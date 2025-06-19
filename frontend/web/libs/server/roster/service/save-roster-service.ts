import 'server-only'
import { SaveRosterRequest } from '../model/save-roster-request'
import { ServerResponse } from '@/libs/share/_general/model/server-response'
import { ServerResponseStatus } from '../../_general/enums/server-response-status'

export const saveRoster = async (request: SaveRosterRequest): Promise<ServerResponse> => {
  // TODO
  return {
    status: ServerResponseStatus.INTERNAL_ERROR,
  }
}