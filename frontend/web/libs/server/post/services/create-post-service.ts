import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { CreatePostRequest, createPostRequestSchema } from '../models/create-post-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';

export const createPostService = async (request: CreatePostRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = createPostRequestSchema.parse(request);

    const createResult = await createPost(parsedRequest);
    if (!createResult.isSuccess) {
      return handleQueryError(createResult.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const createPost = async (request: CreatePostRequest) =>
  await tryCatchQuery(async () =>
    await prisma.post.create({
      data: {
        departmentId: request.departmentId,
        name: request.postName,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('name')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '職位名稱'),
      }
    }
  }

  throw error;
}