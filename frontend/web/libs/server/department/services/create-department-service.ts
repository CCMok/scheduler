import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { CreateDepartmentRequest, createDepartmentRequestSchema, PostRequest, PostWorkerRequest } from '../models/create-department-request';
import prisma from '../../_general/managers/database-manager';
import { getPrismaErrorTarget, tryCatchQuery } from '../../_general/utils/database-utils';
import { PrismaClientKnownRequestError } from '@/external/prisma-generated/runtime/library';
import { PrismaErrorCode } from '../../_general/enums/prisma-error-code';
import { ServiceMessage } from '../../../share/_general/enums/service-message';
import { checkOrgIdAccess } from '../../access/utils/data-access-utils';
import { Id } from '../../_general/models/id';
import { Transaction } from '../../_general/models/prisma-transaction';
import { DepartmentWorkersPosts } from '../models/department-dao';
import { Prisma } from '@/external/prisma-generated';

export const createDepartmentService = async (request: CreateDepartmentRequest): Promise<ServiceResponse<Id>> =>
  await serviceWrapper(async () => {
    const parsedRequest = createDepartmentRequestSchema.parse(request);

    const checkAccessResponse = await checkAccess(parsedRequest.organizationId);
    if (checkAccessResponse) return checkAccessResponse;

    const executeResponse = await execute(parsedRequest);
    if (!executeResponse.isSuccess) {
      return handleQueryError(executeResponse.error)
    }

    return {
      status: ServiceResponseStatus.OK,
      data: executeResponse.data.id,
    }
  })

const checkAccess = async (organizationId: number): Promise<ServiceResponse<Id> | undefined> => {
  const pass = await checkOrgIdAccess(organizationId);
  if (!pass) return {
    status: ServiceResponseStatus.BAD_REQUEST,
    message: ServiceMessage.NOT_FOUND.replaceAll('{0}', '組織'),
  }
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
        message: ServiceMessage.ALREADY_USED.replaceAll('{0}', '名稱'),
      }
    }
  }

  throw error;
}