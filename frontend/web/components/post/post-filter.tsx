import FilterLayout from "@/components/_general/layout/filter/filter-layout";
import PostNameQueryInput from "./post-name-query-input";
import { ReactNode } from "react";

type Props = {
  button?: ReactNode;
};

export default function PostFilter({
  button,
}: Readonly<Props>) {
  return (
    <FilterLayout button={button}>
      <PostNameQueryInput />
    </FilterLayout>
  )
}