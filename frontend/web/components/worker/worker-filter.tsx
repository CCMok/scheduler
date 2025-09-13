import FilterLayout from "@/components/_general/layout/filter/filter-layout";
import WorkerNameQueryInput from "./worker-name-query-input";
import { ReactNode } from "react";

type Props = {
  button?: ReactNode;
};

export default function WorkerFilter({
  button,
}: Readonly<Props>) {
  return (
    <FilterLayout button={button}>
      <WorkerNameQueryInput />
    </FilterLayout>
  )
}