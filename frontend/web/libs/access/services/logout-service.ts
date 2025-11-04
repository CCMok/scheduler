import 'server-only'
import { deleteSession } from '../managers/session-manager'
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const logoutService = tryCatch(async (): Promise<ServiceResponse> => {
  await deleteSession();

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})