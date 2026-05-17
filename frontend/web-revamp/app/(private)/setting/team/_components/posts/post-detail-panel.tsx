import { cn } from "@/external/shadcn/libs/utils";
import { Worker } from "@/external/prisma/generated/client";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import { PostWorker } from "@/libs/post/post";
import UpdatePostNameSection from "./update/name/update-post-name-section";
import UpdatePostWorkersSection from "./update/workers/update-post-workers-section";
import UpdatePostStatusSection from "./update/status/update-post-status-section";
import DeletePostSection from "./delete/delete-post-section";

export default function PostDetailPanel({
  className,
  post,
  workers,
  onDeleteSuccess,
}: Readonly<{
  className?: string;
  post: PostWorker;
  workers: Worker[];
  onDeleteSuccess?: () => void;
}>) {
  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className='space-y-2'>
        <UpdatePostNameSection
          post={post}
        />
        <UpdatePostWorkersSection
          post={post}
          workers={workers}
        />
        <UpdatePostStatusSection
          post={post}
        />
        <DeletePostSection
          postId={post.id}
          onSuccess={onDeleteSuccess}
        />
      </div>
    </ScrollArea>
  )
}