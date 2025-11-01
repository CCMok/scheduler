import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const deleteDepartmentService = tryCatch(async (id: number): Promise<ServiceResponse> => {
  const canAccess = await checkCanAccessDepartment(id);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '部門'),
  }

  await execute(id)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const execute = async (id: number): Promise<void> => {
  await prisma.department.delete({
    where: { id },
  })
}