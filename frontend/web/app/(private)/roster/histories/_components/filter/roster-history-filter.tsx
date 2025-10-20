import FilterLayout from '@/components/_general/layout/filter/filter-layout';
import OrganizationNameQueryInput from "../../../../../../components/organization/organization-name-query-input";
import { ReactNode } from 'react';
import { Param } from '@/libs/share/_general/enums/param';
import DepartmentNameQueryInput from './department-name-query-input';
import CreateDateFromQueryInput from './create-date-from-query-input';

type Props = {
  button?: ReactNode;
};

export default function RosterHistoryFilter({
  button,
}: Readonly<Props>) {
  return (
    <FilterLayout button={button}>
      <OrganizationNameQueryInput paramName={Param.ORGANIZATION_NAME} />
      <DepartmentNameQueryInput />
      <CreateDateFromQueryInput />
    </FilterLayout>
  )
}
