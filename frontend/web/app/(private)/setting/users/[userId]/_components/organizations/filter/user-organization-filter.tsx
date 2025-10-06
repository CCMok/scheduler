import FilterLayout from "@/components/_general/layout/filter/filter-layout";
import OrganizationNameQueryInput from "@/components/organization/organization-name-query-input";
import { ReactNode } from "react";

type Props = {
  button?: ReactNode;
};

export default function UserOrganizationFilter({
  button,
}: Readonly<Props>) {
  return (
    <FilterLayout button={button}>
      <OrganizationNameQueryInput />
    </FilterLayout>
  )
}