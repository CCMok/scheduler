import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { Id } from '../../_general/models/id';
import { getSession } from '../../_general/managers/session-manager';
import { Role } from '@/libs/share/_general/enums/role';
import { SessionPayload } from '../../_general/models/session-payload';
import { CreateOrganizationWithChildrenRequest, createOrganizationWithChildrenRequestSchema, PostWorkerRequest } from '../models/create-organization-with-children-request';
import { Transaction } from '../../_general/models/prisma-transaction';
import { DepartmentWorkersPosts } from '../../department/models/department-dao';

export const createOrganizationWithChildrenService = async (request: CreateOrganizationWithChildrenRequest): Promise<ServiceResponse<Id>> =>
  await serviceWrapper(async () => {
    const parsedRequest = createOrganizationWithChildrenRequestSchema.parse(request);

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

const execute = async (request: CreateOrganizationWithChildrenRequest, session: SessionPayload) =>
  await tryCatchQuery(async () =>
    await prisma.$transaction(async tx => {
      const organization = await createOrganization(tx, request)
      await createPostWorkers(tx, organization.departments[0], request.postWorkers)
      await createUserOrganization(tx, session, organization.id)
      return organization;
    })
  )

const createOrganization = async (tx: Transaction, request: CreateOrganizationWithChildrenRequest) => {
  return await tx.organization.create({
    data: {
      name: request.name,
      departments: {
        create: [
          {
            name: request.departmentName,
            posts: {
              create: request.posts.map((post, index) => ({
                name: post.name,
                displayPosition: index,
              })),
            },
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

const createPostWorkers = async (tx: Transaction, department: DepartmentWorkersPosts, postWorkerRequests: PostWorkerRequest[]) => {
  const postWorkers: { postId: number, workerId: number }[] = [];

  for (const postWorker of postWorkerRequests) {
    if (!postWorker.workerNames.length) continue;

    const post = department.posts.find(post => post.name === postWorker.postName);
    if (!post) {
      console.log('Post not found. name: ', postWorker.postName)
      continue;
    }

    for (const workerName of postWorker.workerNames) {
      const worker = department.workers.find(worker => worker.name === workerName);
      if (!worker) {
        console.log('Worker not found. name: ', workerName)
        continue;
      }

      postWorkers.push({
        postId: post.id,
        workerId: worker.id,
      })
    }
  }

  if (postWorkers.length > 0) {
    await tx.postWorker.createMany({
      data: postWorkers,
    })
  }
}

const createUserOrganization = async (tx: Transaction, session: SessionPayload, organizationId: number) => {
  if (session.roleEnum === Role.SYSTEM_ADMIN) return
  
  await tx.userOrganization.create({
    data: {
      userId: session.userId,
      organizationId: organizationId,
    }
  })
}

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