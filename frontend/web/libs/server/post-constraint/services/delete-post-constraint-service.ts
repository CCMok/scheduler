import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { DeletePostConstraintRequest, deletePostConstraintRequestSchema } from '../models/delete-post-constraint-request';
import prisma from '../../_general/managers/database-manager';
import { ServiceMessage } from '@/libs/share/_general/enums/service-message';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';

export const deletePostConstraintService = async (request: DeletePostConstraintRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = deletePostConstraintRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.id);
    if (checkAccessResponse) return checkAccessResponse;

    await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (id: number): Promise<ServiceResponse | undefined> => {
  const postConstraint = await prisma.postConstraint.findUnique({
    where: { id },
  })
  if (!postConstraint) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位條件'),
  }
  const pass = await checkDeptIdAccess(postConstraint.departmentId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '部門'),
  }
}

const execute = async (request: DeletePostConstraintRequest): Promise<void> => {
  await prisma.postConstraint.delete({
    where: { id: request.id },
  })
}