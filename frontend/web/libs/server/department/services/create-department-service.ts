import 'server-only';
import { CreateDepartmentRequest, createDepartmentRequestSchema, PostRequest, PostWorkerRequest } from '../models/create-department-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { Id } from '../../_general/models/id';
import { Transaction } from '../../_general/models/prisma-transaction';
import { DepartmentWorkersPosts } from '../models/department-dao';
import { Prisma } from '@/external/prisma-generated';
import { ServiceResponse, ServiceResponseStatus } from '../../_general/models/service-response';
import { tryCatch } from '../../_general/services/try-catch-wrapper';
import { getSession } from '../../_general/managers/session-manager';
import { getAccessibleOrganization } from '../../organization/utils/accessible-organization-utils';
import { MessageContent } from '../../_general/enums/message';

export const createDepartmentService = tryCatch(async (request: CreateDepartmentRequest): Promise<ServiceResponse<Id>> => {
  const parsedRequest = createDepartmentRequestSchema.parse(request);

  const canAccess = await checkCanAccess(parsedRequest.organizationId);
  if (!canAccess) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: MessageContent.NOT_FOUND.replaceAll('{0}', '機構'),
  }

  const executeResponse = await execute(parsedRequest);
  if (!executeResponse.isSuccess) {
    return handleQueryError(executeResponse.error)
  }

  return {
    status: ServiceResponseStatus.OK,
    data: executeResponse.data.id,
  }
})

const checkCanAccess = async (organizationId: number): Promise<boolean> => {
  const session = await getSession();
  if (!session) return false;

  const response = await getAccessibleOrganization(session.userId, session.roleEnum);
  if (response.accessAll) return true;

  return response.ids.includes(organizationId);
}

const execute = async (request: CreateDepartmentRequest) =>
  await tryCatchQuery(async () =>
    await prisma.$transaction(async tx => {
      const department = await createDepartment(tx, request)
      await createPostWorkers(tx, department, request.postWorkers)
      return department;
    })
  )

const createDepartment = async (tx: Transaction, request: CreateDepartmentRequest) => {
  const postsClause = createPostsClause(request.posts);

  return await tx.department.create({
    data: {
      organizationId: request.organizationId,
      name: request.name,
      posts: postsClause,
      workers: {
        create: request.workers,
      },
    },
    include: {
      posts: true,
      workers: true,
    },
  })
}

export const createPostsClause = (requests: PostRequest[]): Prisma.PostCreateNestedManyWithoutDepartmentInput => {
  return {
    create: requests.map((post, index) => ({
      name: post.name,
      displayPosition: index,
    })),
  }
}

export const createPostWorkers = async (tx: Transaction, department: DepartmentWorkersPosts, postWorkerRequests: PostWorkerRequest[]) => {
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