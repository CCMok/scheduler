import FilterLayout from '@/components/_general/layout/filter/filter-layout';
import UserNameQueryInput from "./user-name-query-input";
import { ReactNode } from 'react';
import EmailQueryInput from './email-query-input';
import RoleIdQueryInput from './role-id-query-input';
import { Role } from '@/external/prisma-generated';
import { getRolesService } from '@/libs/role/services/get-roles-service';
import { handleGetResponse } from '@/libs/_general/utils/response-utils';
import { redirect } from 'next/navigation';

const getRoles = async (): Promise<Role[]> => {
  const response = await getRolesService();
  return handleGetResponse(response, redirect, [])
}

type Props = {
  button?: ReactNode;
};

export default function UserFilter({
  button,
}: Readonly<Props>) {
  const rolesPromise = getRoles();

  return (
    <FilterLayout button={button}>
      <EmailQueryInput />
      <UserNameQueryInput />
      <RoleIdQueryInput
        rolesPromise={rolesPromise}
      />
    </FilterLayout>
  )
}
