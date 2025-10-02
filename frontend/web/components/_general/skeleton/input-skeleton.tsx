import { Skeleton } from "@/external/shadcn/components/ui/skeleton";

export default function InputSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-(--input-width)" />
    </div>
  );
}