import PostUpdateHeader from "./_components/post-update-header";
import PostUpdateNameSection from "./_components/name/post-update-name-section";
import PostWorkerTableSection from "./_components/post-worker-table-section";
import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { GetPostNameRequest } from "@/libs/server/post/models/get-post-name-request";
import { getPostNameService } from "@/libs/server/post/services/get-post-name-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";

const getPostName = async (id: number): Promise<string> => {
  const request: GetPostNameRequest = { id }

  const name = await fetchData(
    async () => getPostNameService(request),
    path => redirect(path),
    '',
  )

  return name;
}

export default async function PostUpdatePage({
  params,
}: Readonly<ParamProps<{ [Param.ID]: string }>>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const postName = await getPostName(id);
  if (!postName) notFound()

  return (
    <div className="space-y-4">
      <PostUpdateHeader postName={postName} />
      <PostUpdateNameSection postId={id} postName={postName} />
      <PostWorkerTableSection />
    </div>
  )
}