import UpdateWorkerNameSection from "./name/update-worker-name-section";
import UpdateWorkerPostsSection from "./posts/update-worker-posts-section";
import { cn } from "@/external/shadcn/libs/utils";
import { Post } from "@/external/prisma/generated/client";
import { WorkerPost } from "@/libs/worker/worker";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";

export default function UpdateWorkerPanel({
  className,
  worker,
  posts,
}: Readonly<{
  className?: string;
  worker: WorkerPost;
  posts: Post[];
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
      </div>
    </ScrollArea>
  )
}