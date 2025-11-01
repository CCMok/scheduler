import 'server-only';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { Id } from '../../_general/models/id';
import { getSession } from '../../_general/managers/session-manager';
import { Role } from '@/libs/share/_general/enums/role';
import { SessionPayload } from '../../_general/models/session-payload';
import { CreateOrganizationRequest, createOrganizationRequestSchema } from '../models/create-organization-request';
import { Transaction } from '../../_general/models/prisma-transaction';
import { createPostsClause, createPostWorkers } from '../../department/services/create-department-service';
import { DEFAULT_MAX_HISTORY_COUNT } from '../../_general/constants/organization-constant';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { MessageContent } from '../../_general/enums/message';

export const createOrganizationService = tryCatch(async (
  request: CreateOrganizationRequest,
): Promise<ServiceResponse<Id>> => {
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
      const organization = await createOrganization(tx, request)
      await createPostWorkers(tx, organization.departments[0], request.postWorkers)
      if (session.roleEnum !== Role.SYSTEM_ADMIN) {
        await createUserOrganization(tx, session.userId, organization.id)
      }
      return organization;
    })
  )

const createOrganization = async (tx: Transaction, request: CreateOrganizationRequest) => {
  const postsClause = createPostsClause(request.posts);

  return await tx.organization.create({
    data: {
      name: request.name,
      maxHistoryCount: DEFAULT_MAX_HISTORY_COUNT,
      departments: {
        create: [
          {
            name: request.departmentName,
            posts: postsClause,
            workers: {
              create: request.workers,
            },
          },
        ],
      }
    },
    include: {
      departments: {
        include: {
          posts: true,
          workers: true,
        },
      },
    },
  })
}

const createUserOrganization = async (tx: Transaction, userId: number, organizationId: number) => {
  await tx.userOrganization.create({
    data: {
      userId,
      organizationId,
    }
  })
}

const handleQueryError = (error: PrismaClientKnownRequestError): ServiceResponse<Id> => {
  if (error.code === PrismaErrorCode.UNIQUE_CONSTRAINT_VIOLATION) {
    const target = getPrismaErrorTarget(error)

    if (target?.includes('name')) {
      return {
        status: ServiceResponseStatus.BAD_REQUEST,
        message: MessageContent.ALREADY_USED.replaceAll('{0}', '名稱'),
      }
    }
  }

  throw error;
}