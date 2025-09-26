import 'server-only'
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { CreatePostConstraintRequest, createPostConstraintRequestSchema } from "../models/create-post-constraint-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { ServiceMessage } from "../../../share/_general/enums/service-message";;
import { serviceWrapper } from '../../_general/services/general-service';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';
import { PostConstraint } from '@/external/prisma-generated';
import { Id } from '../../_general/models/id';

export const createPostConstraintService = async (request: CreatePostConstraintRequest): Promise<ServiceResponse<Id>> =>
  await serviceWrapper<Id>(async () => {
    const parsedRequest = createPostConstraintRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.departmentId);
    if (checkAccessResponse) return checkAccessResponse;

    const entity = await execute(parsedRequest)

    return {
      status: ServiceResponseStatus.OK,
      data: entity.id,
    }
  })

const checkAccess = async (departmentId: number): Promise<ServiceResponse<Id> | undefined> => {  
  const pass = await checkDeptIdAccess(departmentId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '部門'),
  }
}

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
