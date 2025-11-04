import FilterLayout from "@/components/_general/layout/filter/filter-layout";
import DepartmentNameQueryInput from "./department-name-query-input";
import { ReactNode } from "react";

type Props = {
  button?: ReactNode;
};

export default function DepartmentFilter({
  button,
}: Readonly<Props>) {
  return (
    <FilterLayout button={button}>
      <DepartmentNameQueryInput />
    </FilterLayout>
  )
}