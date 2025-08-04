import 'server-only'
import { deleteSession } from '../../_general/managers/session-manager'
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { ServiceResponseStatus } from '../../../share/_general/enums/service-response-status';
import { serviceWrapper } from '../../_general/services/general-service';

export const logout = async (): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    await deleteSession();

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })