import 'server-only'
import { deleteSession } from '../../_general/managers/session-manager'
import { ServiceResponse as OldServiceResponse } from '@/libs/share/_general/models/service-response';
import { ServiceResponseStatus as OldServiceResponseStatus } from '../../../share/_general/enums/service-response-status';
import { serviceWrapper } from '../../_general/services/general-service';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';

export const logoutService = tryCatch(async (): Promise<ServiceResponse> => {
  await deleteSession();

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

export const OldlogoutService = async (): Promise<OldServiceResponse> =>
  await serviceWrapper(async () => {
    await deleteSession();

    return {
      status: OldServiceResponseStatus.OK,
      data: {},
    }
  })