import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { tryCatch } from '../../_general/utils/service-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../access/utils/data-access-utils';
import { MessageContent } from '../../_general/enums/message';

export const deleteRosterHistoryService = tryCatch(async (
  id: number,
): Promise<ServiceResponse> => {
  const canAccess = await checkAccess(id);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '值班表紀錄'),
  }

  await execute(id)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const checkAccess = async (id: number): Promise<boolean> => {
  const rosterHistory = await prisma.rosterHistory.findUnique({
    where: {
      id,
    },
    select: {
      departmentId: true,
    },
  })

  if (!rosterHistory) return false

  return await checkCanAccessDepartment(rosterHistory.departmentId);
}

const execute = async (id: number): Promise<void> => {
  await prisma.rosterHistory.delete({
    where: { id },
  })
}