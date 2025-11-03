import 'server-only'
import { deleteSession } from '../../_general/managers/session-manager'
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const logoutService = tryCatch(async (): Promise<ServiceResponse> => {
  await deleteSession();

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})