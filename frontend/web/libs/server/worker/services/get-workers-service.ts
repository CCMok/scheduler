import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import prisma from "../../_general/managers/database-manager";
import { Prisma, Worker } from '@/external/prisma-generated';
import { GetWorkersRequest, getWorkersRequestSchema } from '../models/get-workers-request';
import { serviceWrapper } from '../../_general/services/general-service';
import { getAccessibleDepartmentIdsService } from '../../access/services/data-access-service';
import { AccessResponse } from '../../access/models/access-response';
import { isNil } from 'lodash';

export const getWorkersService = async (request: GetWorkersRequest): Promise<ServiceResponse<Worker[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkersRequestSchema.parse(request);

    const accessResponse = await getAccessibleDepartmentIdsService();
    if (accessResponse.status !== ServiceResponseStatus.OK) return accessResponse

    const query = getQuery(parsedRequest, accessResponse.data);

    const workers = await prisma.worker.findMany(query);

    return {
      status: ServiceResponseStatus.OK,
      data: workers,
    };
  });

const getQuery = (request: GetWorkersRequest, accessResponse: AccessResponse) => {
  const where = getWhereClause(request, accessResponse);
  const orderBy = getOrderByClause(request);

  return { where, orderBy };
}

const getWhereClause = (request: GetWorkersRequest, accessResponse: AccessResponse) => {
  const departmentIdFilter = getDepartmentIdFilter(request, accessResponse);

  return {
    ...request.where,
    isDeleted: false,
    departmentId: departmentIdFilter,
  }
}

const getDepartmentIdFilter = (request: GetWorkersRequest, accessResponse: AccessResponse) => {
  if (accessResponse.canAccessAll) {
    if (isNil(request.where?.departmentId)) return;
    return request.where.departmentId;
  }

  if (isNil(request.where?.departmentId)) return { in: accessResponse.ids };

  if (accessResponse.ids.includes(request.where.departmentId)) return request.where.departmentId;

  return { in: [] }
}

const getOrderByClause = (request: GetWorkersRequest) => {
  const orderBy: Prisma.WorkerOrderByWithRelationInput = {};

  if (!request.orderBy) return orderBy;

  for (const requestOrderBy of request.orderBy) {
    orderBy[requestOrderBy.field] = requestOrderBy.direction ?? Prisma.SortOrder.asc;
  }

  return orderBy;
}