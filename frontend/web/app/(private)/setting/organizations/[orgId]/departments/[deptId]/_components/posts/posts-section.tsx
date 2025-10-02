import CreatePostButton from "./create/create-post-button";
import CustomCard from "@/components/_general/card/custom-card";
import PostFilter from "@/components/post/post-filter";
import DepartmentPostTableServer from "./table/department-post-table-server";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";

type Props = {
  deptId: number;
}

export default async function PostsSection({
  deptId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <PostFilter button={<CreatePostButton />} />
      <Suspense fallback={<TableSkeleton />}>
        <DepartmentPostTableServer deptId={deptId} />
      </Suspense>
    </CustomCard>
  )
}