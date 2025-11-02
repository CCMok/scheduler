import 'server-only'
import { CreatePostConstraintRequest, createPostConstraintRequestSchema } from "../models/create-post-constraint-request";
import prisma from "../../_general/managers/database-manager";
import { PostConstraint } from '@/external/prisma-generated';
import { Id } from '../../_general/models/id';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { checkCanAccessDepartment } from '../../organization/utils/access-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const createPostConstraintService = tryCatch(async (
  request: CreatePostConstraintRequest,
): Promise<ServiceResponse<Id>> => {
  const parsedRequest = createPostConstraintRequestSchema.parse(request)

  const canAccess = await checkCanAccessDepartment(parsedRequest.departmentId)
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '部門'),
  }

  const data = await execute(parsedRequest)

  return {
    status: ServiceResponseStatus.OK,
    data: data.id,
  }
})

const execute = async (request: CreatePostConstraintRequest): Promise<PostConstraint> =>
  await prisma.postConstraint.create({
    data: {
      departmentId: request.departmentId,
      postConstraintTypeId: request.postConstraintTypeId,
      weighting: request.weighting,
      postConstraintPosts: {
        create: request.postIds.map(id => ({ postId: id })),
      }
    },
  })
