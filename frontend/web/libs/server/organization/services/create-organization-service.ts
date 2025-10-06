import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { CreateOrganizationRequest, createOrganizationRequestSchema } from '../../organization/models/create-organization-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { Id } from '../../_general/models/id';
import { getSession } from '../../_general/managers/session-manager';
import { Role } from '@/libs/share/_general/enums/role';
import { SessionPayload } from '../../_general/models/session-payload';

export const createOrganizationService = async (request: CreateOrganizationRequest): Promise<ServiceResponse<Id>> =>
  await serviceWrapper(async () => {
    const parsedRequest = createOrganizationRequestSchema.parse(request);

    const session = await getSession();
    if (!session) return {
      status: ServiceResponseStatus.UNAUTHORIZED,
    }

    const executeResponse = await execute(parsedRequest, session);
    if (!executeResponse.isSuccess) {
      return handleQueryError(executeResponse.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: executeResponse.data.id,
    }
  })

const execute = async (request: CreateOrganizationRequest, session: SessionPayload) =>
  await tryCatchQuery(async () =>
    await prisma.$transaction(async tx => {
      const organization = await prisma.organization.create({
        data: {
          name: request.name,
        }
      })

      if (session.roleEnum !== Role.SYSTEM_ADMIN) {
        await tx.userOrganization.create({
          data: {
            userId: session.userId,
            organizationId: organization.id,
          }
        })
      }

      return organization;
    })
  )

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse<Id> => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('name')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '名稱'),
      }
    }
  }

  throw error;
}