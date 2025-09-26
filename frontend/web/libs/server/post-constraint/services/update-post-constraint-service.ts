import 'server-only'
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { UpdatePostConstraintRequest, updatePostConstraintRequestSchema } from "../models/update-post-constraint-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { ServiceMessage } from "../../../share/_general/enums/service-message";;
import { serviceWrapper } from '../../_general/services/general-service';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';

export const updatePostConstraintService = async (request: UpdatePostConstraintRequest): Promise<ServiceResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = updatePostConstraintRequestSchema.parse(request)

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

const execute = async (request: UpdatePostConstraintRequest): Promise<void> => {
  await prisma.postConstraint.update({
    where: { id: request.id },
    data: {
      postConstraintTypeId: request.postConstraintTypeId,
      weighting: request.weighting,
      postConstraintPosts: {
        deleteMany: {},
        create: request.postIds.map(id => ({ postId: id })),
      }
    },
  })
}