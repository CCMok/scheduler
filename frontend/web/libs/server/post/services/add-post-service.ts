import 'server-only';
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ServerResponseStatus } from "../../_general/enums/server-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { AddPostRequest, addPostRequestSchema } from '../models/add-post-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServerMessage } from '../../_general/enums/server-message';

export const addPost = async (request: AddPostRequest): Promise<ServerResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = addPostRequestSchema.parse(request);

    const createResult = await createPost(parsedRequest);
    if (!createResult.isSuccess) {
      return handleQueryError(createResult.error)
    }

    return {
      status: ServerResponseStatus.OK,
      data: {},
    }
  })

const createPost = async (request: AddPostRequest) =>
  await tryCatchQuery(async () =>
    await prisma.post.create({
      data: {
        departmentId: request.departmentId,
        name: request.postName,
      }
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServerResponse => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('name')) {
      return {
        status: ServerResponseStatus.BAD_REQUEST,
        message: ServerMessage.ALREADY_USED.replaceAll('{0}', '職位名稱'),
      }
    }
  }

  throw error;
}