import { Post } from "@/external/prisma-generated";
import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { getPostsService } from "@/libs/server/post/services/get-posts-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

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