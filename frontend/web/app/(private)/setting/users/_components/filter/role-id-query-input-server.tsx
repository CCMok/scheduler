import RoleIdQueryInput from './role-id-query-input';
import { Role } from '@/external/prisma-generated';
import { Suspense } from 'react';
import InputSkeleton from '@/components/_general/skeleton/input-skeleton';
import { getRolesService } from '@/libs/server/role/services/get-roles-service';
import { fetchData } from '@/libs/share/_general/utils/fetch';
import { redirect } from 'next/navigation';

const getRoles = async (): Promise<Role[]> => {
  return await fetchData(
    async () => getRolesService({
      orderBys: [{ field: 'enum' }],
    }),
    path => redirect(path),
    [],
  )
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