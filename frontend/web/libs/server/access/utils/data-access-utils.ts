import 'server-only';
import { cache } from 'react';
import { getAccessibleDeptIdsService, getAccessibleOrgIdsService, getAccessiblePostIdsService, getAccessibleWorkerIdsService } from '../services/data-access-service';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { isNil } from 'lodash';
import { AccessResponse } from '../models/access-response';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';

const getIdFilter = (id: number | undefined, accessServiceResponse: ServiceResponse<AccessResponse>) => {
  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return { in: [] };
  if (accessServiceResponse.data.canAccessAll) return id;
  if (isNil(id)) return { in: accessServiceResponse.data.ids };
  if (accessServiceResponse.data.ids.includes(id)) return id;
  return { in: [] }
}

export const getOrgIdFilter = cache(async (orgId: number | undefined) => {
  const accessResponse = await getAccessibleOrgIdsService();
  return getIdFilter(orgId, accessResponse);
})

export const getDeptIdFilter = cache(async (deptId: number | undefined) => {
  const accessResponse = await getAccessibleDeptIdsService();
  return getIdFilter(deptId, accessResponse);
})

const checkIdAccess = (id: number, accessServiceResponse: ServiceResponse<AccessResponse>) => {
  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return false;
  if (accessServiceResponse.data.canAccessAll) return true;
  return accessServiceResponse.data.ids.includes(id);
}

export const checkOrgIdAccess = cache(async (orgId: number): Promise<boolean> => {
  const accessServiceResponse = await getAccessibleOrgIdsService();
  return checkIdAccess(orgId, accessServiceResponse);
})

export const checkDeptIdAccess = cache(async (deptId: number): Promise<boolean> => {
  const accessServiceResponse = await getAccessibleDeptIdsService();
  return checkIdAccess(deptId, accessServiceResponse);
})

export const checkPostIdAccess = cache(async (postId: number): Promise<boolean> => {
  const accessServiceResponse = await getAccessiblePostIdsService();
  return checkIdAccess(postId, accessServiceResponse);
})

export const checkWorkerIdAccess = cache(async (workerId: number): Promise<boolean> => {
  const accessServiceResponse = await getAccessibleWorkerIdsService();
  return checkIdAccess(workerId, accessServiceResponse);
})

const checkIdsAccess = (ids: number[], accessServiceResponse: ServiceResponse<AccessResponse>) => {
  if (accessServiceResponse.status !== ServiceResponseStatus.OK) return false;
  if (accessServiceResponse.data.canAccessAll) return true;
  for (const id of ids) {
    if (!accessServiceResponse.data.ids.includes(id)) return false;
  }
  return true;
}

export const checkPostIdsAccess = cache(async (postIds: number[]): Promise<boolean> => {
  const accessServiceResponse = await getAccessiblePostIdsService();
  return checkIdsAccess(postIds, accessServiceResponse);
})