import UpdateWorkerNameSection from "./update/name/update-worker-name-section";
import UpdateWorkerPostsSection from "./update/posts/update-worker-posts-section";
import { cn } from "@/external/shadcn/libs/utils";
import { Post } from "@/external/prisma/generated/client";
import { WorkerPost } from "@/libs/worker/worker";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import DeleteWorkerSection from "./delete/delete-worker-section";
import UpdateWorkerStatusSection from "./update/status/update-worker-status-section";

export default function WorkerDetailPanel({
  className,
  worker,
  posts,
  onDeleteSuccess,
}: Readonly<{
  className?: string;
  worker: WorkerPost;
  posts: Post[];
  onDeleteSuccess?: () => void;
}>) {
  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className='space-y-2'>
        <UpdateWorkerNameSection
          worker={worker}
        />
        <UpdateWorkerPostsSection
          worker={worker}
          posts={posts}
        />
        <UpdateWorkerStatusSection
          worker={worker}
        />
        <DeleteWorkerSection
          workerId={worker.id}
          onSuccess={onDeleteSuccess}
        />
      </div>
    </ScrollArea>
  )
}