import { cn } from "@/external/shadcn/libs/utils";
import { Post } from "@/external/prisma/generated/client";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";

export default function CreateWorkerPanel({
  className,
  posts,
  teamId,
}: Readonly<{
  className?: string;
  posts: Post[];
  teamId: number;
}>) {
  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className='space-y-2'>
        Create Worker panel
        {/* TODO */}
      </div>
    </ScrollArea>
  )
}