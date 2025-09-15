import 'server-only'
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { UpdatePostConstraintRequest, updatePostConstraintRequestSchema } from "../models/update-post-constraint-request";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { ServiceMessage } from "../../../share/_general/enums/service-message";
import { DataBaseQueryResponse } from "../../_general/models/database-query-response";
import { PrismaErrorCode } from "../../_general/enums/prisma-error-code";
import { getPrismaErrorTarget, tryCatchQuery } from "../../_general/utils/database-utils";
import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library";
import { serviceWrapper } from '../../_general/services/general-service';
import { checkDeptIdAccess } from '../../access/utils/data-access-utils';

export const updatePostConstraintService = async (request: UpdatePostConstraintRequest): Promise<ServiceResponse> =>
  await serviceWrapper<{}>(async () => {
    const parsedRequest = updatePostConstraintRequestSchema.parse(request)

    const checkAccessResponse = await checkAccess(parsedRequest.departmentId);
    if (checkAccessResponse) return checkAccessResponse;

    const executeResponse = await execute(parsedRequest)
    // if (!executeResponse.isSuccess) {
    //   return handleQueryError(executeResponse.error)
    // }

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

const execute = async (request: UpdatePostConstraintRequest): Promise<DataBaseQueryResponse> =>
  await tryCatchQuery(async () =>
    await prisma.postConstraint.update({
      where: { id: request.id },
      data: {
        departmentId: request.departmentId,
        postConstraintTypeId: request.postConstraintTypeId,
        weighting: request.weighting,
        postConstraintPosts: {
          deleteMany: {},
          create: request.postIds.map(id => ({ postId: id })),
        }
      },
    })
  )

  // TODO
// const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse => {
//   if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
//     const target = getPrismaErrorTarget(error)

//     if (target?.includes('name')) {
//       return {
//         status: ServiceResponseStatus.BAD_REQUEST,
//         message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '名稱'),
//       }
//     }
//   }

//   throw error;
// }