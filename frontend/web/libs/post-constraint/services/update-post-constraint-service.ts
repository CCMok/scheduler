import 'server-only'
import { UpdatePostConstraintRequest, updatePostConstraintRequestSchema } from "../models/update-post-constraint-request";
import prisma from "../../_general/managers/database-manager";
import { tryCatch } from '../../_general/utils/service-utils';
import { checkCanAccessDepartment } from '../../access/utils/data-access-utils';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';

export const updatePostConstraintService = tryCatch(async (
  request: UpdatePostConstraintRequest,
): Promise<ServiceResponse> => {
  const parsedRequest = updatePostConstraintRequestSchema.parse(request)
  
  const canAccess = await checkAccess(parsedRequest.id)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '職位條件'),  
  }

  await execute(parsedRequest)

  return {
    status: ServiceResponseStatus.OK,
    data: {},
  }
})

const checkAccess = async (id: number): Promise<boolean> => {
  const postConstraint = await prisma.postConstraint.findUnique({
    select: { departmentId: true },
    where: { id },
  })
  if (!postConstraint) return false

  return await checkCanAccessDepartment(postConstraint.departmentId);
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