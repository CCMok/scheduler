import CustomCard from "@/components/_general/card/custom-card";
import InputSkeleton from "@/components/_general/skeleton/input-skeleton";
import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { Skeleton } from "@/external/shadcn/components/ui/skeleton";

export default function RosterFilterSkeleton() {
  return (
    <div className='space-y-4'>
      <CustomCard>
        <div className='flex gap-4'>
          <InputSkeleton />
          <InputSkeleton />
          <InputSkeleton />
        </div>
      </CustomCard>
      <CustomCard title={<Skeleton className="h-4 w-20" />}>
        <TableSkeleton />
      </CustomCard>
    </div>
  )
}