import CreatePostButton from "./create/create-post-button";
import CustomCard from "@/components/_general/card/custom-card";
import PostFilter from "@/components/post/post-filter";
import DepartmentPostTableServer from "./table/department-post-table-server";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";

type Props = {
  departmentId: number;
}

export default async function PostsSection({
  departmentId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <PostFilter button={<CreatePostButton departmentId={departmentId} />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentPostTableServer departmentId={departmentId} />
      </Suspense>
    </CustomCard>
  )
}