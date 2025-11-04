import { Post } from "@/external/prisma-generated";
import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { getPostsService } from "@/libs/post/services/get-posts-service";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const getPost = async (id: number): Promise<Post | undefined> => {
  const response = await getPostsService(id)
  const data = handleGetResponse(response, redirect, [])
  return data[0]
}

export type Props = {
  id?: number;
  failNotFound?: boolean;
}

async function PostNameContent({
  id,
  failNotFound = false,
}: Readonly<Props>) {
  if (isNil(id)) {
    if (failNotFound) notFound();
    return '';
  }

  const post = await getPost(id);
  if (!post) {
    if (failNotFound) notFound();
    return '';
  }

  return post.name;
}

export default function PostName({
  id,
  failNotFound,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<Skeleton className='h-4 w-20' />}>
      <PostNameContent
        id={id}
        failNotFound={failNotFound}
      />
    </Suspense>
  )
}