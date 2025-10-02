import { Post } from "@/external/prisma-generated"
import { getPostsService } from "@/libs/server/post/services/get-posts-service"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { notFound, redirect } from "next/navigation"
import UpdatePostNameSection from "./update-post-name-section"
import { Suspense } from "react"
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton"

const getPost = async (id: number): Promise<Post | undefined> => {
  const posts = await fetchData(
    async () => await getPostsService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )

  return posts[0];
}

type Props = {
  id: number;
}

async function UpdatePostNameSectionServerContent({
  id,
}: Readonly<Props>) {
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <UpdatePostNameSection
      post={post}
    />
  )
}

export default function UpdatePostNameSectionServer({
  id,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <UpdatePostNameSectionServerContent id={id} />
    </Suspense>
  )
}