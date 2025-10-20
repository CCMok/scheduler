import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeleteRosterHistoryRequest, deleteRosterHistoryRequestSchema } from '../models/delete-roster-history-request';
import prisma from '../../_general/managers/database-manager';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';

export const deleteRosterHistoryService = async (request: DeleteRosterHistoryRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deleteRosterHistoryRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.id);
    if (checkAccessResponse) return checkAccessResponse;

    await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (id: number): Promise<ServiceResponse | undefined> => {
  const rosterHistory = await prisma.rosterHistory.findUnique({
    where: {
      id,
    },
    select: {
      departmentId: true,
    },
  })

  if (!rosterHistory) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '值班表紀錄'),
  }

  const pass = await checkDeptIdAccess(rosterHistory.departmentId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '值班表紀錄'),
  }
}

const execute = async (request: DeleteRosterHistoryRequest): Promise<void> => {
  await prisma.rosterHistory.delete({
    where: { id: request.id },
  })
}