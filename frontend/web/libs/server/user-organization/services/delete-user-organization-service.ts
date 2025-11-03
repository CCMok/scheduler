import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { DeleteUserOrganizationRequest, deleteUserOrganizationRequestSchema } from '../models/delete-user-organization-request';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessOrganization } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const deleteUserOrganizationService = tryCatch(async (
  request: DeleteUserOrganizationRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = deleteUserOrganizationRequestSchema.parse(request)

  const canAccess = await checkCanAccessOrganization(parsedRequest.organizationId);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '機構'),
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