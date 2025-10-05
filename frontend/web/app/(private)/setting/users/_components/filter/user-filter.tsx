import FilterLayout from '@/components/_general/layout/filter/filter-layout';
import UserNameQueryInput from "./user-name-query-input";
import { ReactNode } from 'react';
import EmailQueryInput from './email-query-input';
import RoleIdQueryInputServer from './role-id-query-input-server';

type Props = {
  button?: ReactNode;
};

export default function UserFilter({
  button,
}: Readonly<Props>) {
  return (
    <FilterLayout button={button}>
      <EmailQueryInput />
      <UserNameQueryInput />
      <RoleIdQueryInputServer />
    </FilterLayout>
  )
}
