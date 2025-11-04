import { redirect } from "next/navigation";
import { getPostsService } from "@/libs/post/services/get-posts-service";
import { Post } from "@/external/prisma-generated";
import PostSaveButton from "./button/post-sequence-save-button";
import { PostSequenceStoreProvider } from "./store/post-sequence-store-provider";
import CustomCard from "@/components/_general/card/custom-card";
import PostSequenceTableContainer from "./table/post-sequence-table-container";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Suspense } from "react";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getPosts = async (departmentId: number): Promise<Post[]> => {
  const response = await getPostsService(undefined, departmentId, undefined, true)
  return handleGetResponse(response, redirect, [])
}

type Props = {
  departmentId: number;
}

async function PostsSequenceSectionContent({
  departmentId,
}: Readonly<Props>) {
  const posts = await getPosts(departmentId);

  return (
    <PostSequenceStoreProvider initState={{
      posts,
    }}>
      <div className='space-y-2'>
        <PostSequenceTableContainer />
        <div className='flex justify-end'>
          <PostSaveButton />
        </div>
      </div>
    </PostSequenceStoreProvider>
  )
}

export default function PostsSequenceSection({
  departmentId,
}: Readonly<Props>) {
  return (
    <CustomCard>
      <Suspense fallback={<TableSkeleton />}>
        <PostsSequenceSectionContent departmentId={departmentId} />
      </Suspense>
    </CustomCard>
  )
}