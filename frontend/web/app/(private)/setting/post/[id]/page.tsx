import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import IndividualSettingLayout from "@/components/layout/setting/individual-setting-layout";
import UpdatePostNameSection from "./_components/update-name/update-post-name-section";
import { Post } from "@/external/prisma-generated";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";

const getPost = async (id: number): Promise<Post | undefined> => {
  const posts = await fetchData(
    async () => await getPostsService({ where: { id } }),
    path => redirect(path),
    [],
  )

  return posts[0];
}

type Props = ParamProps<{ [Param.ID]: string }>

export default async function PostEditPage({
  params,
}: Readonly<Props>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const post = await getPost(id);
  if (!post) notFound()

  return (
    <IndividualSettingLayout
      title={post.name}
      updateNameSection={<UpdatePostNameSection post={post} />}
      // TODO
      // otherSection={<ChildrenSection departmentId={id} />}
    />
  )
}