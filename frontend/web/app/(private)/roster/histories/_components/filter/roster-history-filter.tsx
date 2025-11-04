import FilterLayout from '@/components/_general/layout/filter/filter-layout';
import OrganizationNameQueryInput from "../../../../../../components/organization/organization-name-query-input";
import { ReactNode } from 'react';
import { Param } from '@/libs/_general/enums/param';
import CreateDateFromQueryInput from './create-date-from-query-input';
import DepartmentNameQueryInput from '@/app/(private)/setting/organizations/[orgId]/_components/departments/filter/department-name-query-input';

type Props = {
  button?: ReactNode;
};

export default function RosterHistoryFilter({
  button,
}: Readonly<Props>) {
  return (
    <FilterLayout button={button}>
      <OrganizationNameQueryInput paramName={Param.ORGANIZATION_NAME} />
      <DepartmentNameQueryInput paramName={Param.DEPARTMENT_NAME} />
      <CreateDateFromQueryInput />
    </FilterLayout>
  )
}
