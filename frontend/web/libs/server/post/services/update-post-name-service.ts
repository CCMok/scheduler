import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { UpdatePostNameRequest, updatePostNameRequestSchema } from '../models/update-post-name-request';
import { getAccessiblePostIdsService } from '../../access/services/access-service';

export const updatePostNameService = async (request: UpdatePostNameRequest): Promise<ServiceResponse> =>
  await serviceWrapper(async () => {
    const parsedRequest = updatePostNameRequestSchema.parse(request);

    const checkAccessResponse = await checkAccess(parsedRequest.id);
    if (checkAccessResponse) return checkAccessResponse;

    const updateResult = await updatePost(parsedRequest);
    if (!updateResult.isSuccess) {
      return handleQueryError(updateResult.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: {},
    }
  })

const checkAccess = async (id: number): Promise<ServiceResponse | undefined> => {
  const accessServiceResponse = await getAccessiblePostIdsService();

  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse;

  if (accessServiceResponse.data.canAccessAll || accessServiceResponse.data.ids.includes(id)) return;

  return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '職位'),
  }
}

const updatePost = async (request: UpdatePostNameRequest) =>
  await tryCatchQuery(async () =>
    await prisma.post.update({
      where: { id: request.id },
      data: {
        name: request.name,
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