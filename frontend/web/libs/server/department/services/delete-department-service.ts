import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeleteDepartmentRequest, deleteDepartmentRequestSchema } from '../models/delete-department-request';
import prisma from '../../_general/managers/database-manager';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';

export const deleteDepartmentService = async (request: DeleteDepartmentRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deleteDepartmentRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.id);
    if (checkAccessResponse) return checkAccessResponse;

    await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (id: number): Promise<ServiceResponse | undefined> => {
  const pass = await checkDeptIdAccess(id);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '部門'),
  }
}

const execute = async (request: DeleteDepartmentRequest): Promise<void> => {
  await prisma.department.delete({
    where: { id: request.id },
  })
}