
import UpdateChildLayout from "@/components/layout/update-child/update-child-layout";
import PostsSequenceTableSection from "./sequence/posts-sequence-table-section";
import PostIndividualTableSection from "./individual/post-individaul-table-section";

type Props = {
  deptId: number;
}

export default function PostsSection({
  deptId,
}: Readonly<Props>) {
  return (
    <UpdateChildLayout childName="職位">
      <PostIndividualTableSection deptId={deptId} />
      <PostsSequenceTableSection deptId={deptId} />
    </UpdateChildLayout>
  )
}