import { Post } from "@/external/prisma-generated"
import { getPostsService } from "@/libs/post/services/get-posts-service"
import { notFound, redirect } from "next/navigation"
import UpdatePostNameSection from "./update-post-name-section"
import { Suspense } from "react"
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton"
import { handleGetResponse } from "@/libs/_general/utils/response-utils"

const getPost = async (id: number): Promise<Post | undefined> => {
  const response = await getPostsService(id)
  const data = handleGetResponse(response, redirect, [])
  return data[0]
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