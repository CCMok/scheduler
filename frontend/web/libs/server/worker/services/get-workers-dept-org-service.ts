import 'server-only';
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { serviceWrapper } from '../../_general/services/general-service';
import { GetWorkersDeptOrgRequest, getWorkersDeptOrgRequestSchema } from '../models/get-workers-dept-org-request';
import { WorkerDeptOrg } from '../models/worker-dao';
import { getAccessibleDepartmentIdsService } from '../../access/services/data-access-service';
import { AccessResponse } from '../../access/models/access-response';
import prisma from '../../_general/managers/database-manager';
import { isNil } from 'lodash';

export const getWorkersDeptOrgService = async (request: GetWorkersDeptOrgRequest): Promise<ServiceResponse<WorkerDeptOrg[]>> =>
  await serviceWrapper(async () => {
    const parsedRequest = getWorkersDeptOrgRequestSchema.parse(request);

    const accessServiceResponse = await getAccessibleDepartmentIdsService();
    if (accessServiceResponse.status !== ServiceResponseStatus.OK) return accessServiceResponse

    const workers = await findWorkers(parsedRequest, accessServiceResponse.data);

    return {
      status: ServiceResponseStatus.OK,
      data: workers,
    };
  })

const findWorkers = async (request: GetWorkersDeptOrgRequest, accessResponse: AccessResponse): Promise<WorkerDeptOrg[]> => {
  const workers = await prisma.worker.findMany({
    where: {
      ...(isNil(request.where?.deptId) ? {} : { departmentId: request.where.deptId }),
      ...(isNil(request.where?.orgId) ? {} : { department: { organizationId: request.where.orgId } }),
    },
    include: {
      department: {
        include: { organization: true },
      }
    }
  })

  if (accessResponse.canAccessAll) return workers

  return workers.filter(worker => accessResponse.ids.includes(worker.departmentId))
}