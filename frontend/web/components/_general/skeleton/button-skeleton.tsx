import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { cn } from "@/external/shadcn/libs/utils";
import { ClassNameProps } from "@/libs/_general/props/class-name-props";

export default function ButtonSkeleton({
  className,
}: Readonly<ClassNameProps>) {
  return (
    <Skeleton className={cn("h-9 w-20", className)} />
  );
}