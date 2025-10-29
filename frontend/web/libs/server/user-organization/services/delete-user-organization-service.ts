import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { DeleteUserOrganizationRequest, deleteUserOrganizationRequestSchema } from '../models/delete-user-organization-request';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import { checkOrgIdAccess } from '../../access/utils/data-access-utils';

export const deleteUserOrganizationService = async (request: DeleteUserOrganizationRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deleteUserOrganizationRequestSchema.parse(request)

    const canAccess = await checkOrgIdAccess(parsedRequest.organizationId);
    if (!canAccess) return {
      status: ServiceResponseStatus.BAD_REQUEST,
      message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '機構'),
    };

    await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const execute = async (request: DeleteUserOrganizationRequest): Promise<void> => {
  await prisma.userOrganization.delete({
    where: {
      userId_organizationId: {
        userId: request.userId,
        organizationId: request.organizationId,
      },
    },
  })
}