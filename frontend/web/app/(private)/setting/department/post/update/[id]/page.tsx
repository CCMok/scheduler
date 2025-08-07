import PostUpdateHeader from "./_components/post-update-header";
import PostUpdateNameSection from "./_components/post-update-name-section";
import PostWorkerTableSection from "./_components/post-worker-table-section";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";

export default async function PostUpdatePage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {
  const id = (await params).id;

  return (
    <div className="space-y-4">
      <PostUpdateHeader postId={Number(id)} />
      <PostUpdateNameSection />
      <PostWorkerTableSection />
    </div>
  )
}