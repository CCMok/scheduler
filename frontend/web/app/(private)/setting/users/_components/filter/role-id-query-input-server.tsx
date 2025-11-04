import RoleIdQueryInput from './role-id-query-input';
import { Role } from '@/external/prisma-generated';
import { Suspense } from 'react';
import InputSkeleton from '@/components/_general/skeleton/input-skeleton';
import { getRolesService } from '@/libs/role/services/get-roles-service';
import { redirect } from 'next/navigation';
import { handleGetResponse } from '@/libs/_general/utils/response-utils';

const getRoles = async (): Promise<Role[]> => {
  const response = await getRolesService();
  return handleGetResponse(response, redirect, [])
}

const RoleIdQueryInputContent = async () => {
  const roles = await getRoles();
  return <RoleIdQueryInput roles={roles} />;
}

export default function RoleIdQueryInputServer() {
  return (
    <Suspense fallback={<InputSkeleton />}>
      <RoleIdQueryInputContent />
    </Suspense>
  )
}