import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const deletePostConstraintService = tryCatch(async (
  id: number,
): Promise<ServiceResponse> => {
  const canAccess = await checkAccess(id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '職位條件'),
  }

  await execute(id)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const checkAccess = async (id: number): Promise<boolean> => {
  const postConstraint = await prisma.postConstraint.findUnique({
    where: { id },
  })

  if (!postConstraint) return false

  return await checkCanAccessDepartment(postConstraint.departmentId);
}

const execute = async (id: number): Promise<void> => {
  await prisma.postConstraint.delete({
    where: { id },
  })
}