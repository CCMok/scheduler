import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import CustomCard from "../card/custom-card";
import TableSkeleton from "./table-skeleton";

export default function TableCardSkeleton() {
  return (
    <CustomCard title={<Skeleton className="h-4 w-20" />}>
      <TableSkeleton />
    </CustomCard>
  )
}