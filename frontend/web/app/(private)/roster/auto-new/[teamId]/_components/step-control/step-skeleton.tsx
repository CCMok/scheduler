import { Skeleton } from "@/external/shadcn/components/ui/skeleton";

export default function StepSkeleton() {
  return (
    <div className='space-y-4'>
      <Skeleton className='h-5 w-50' />
      <Skeleton className='h-5 w-80' />
      <Skeleton className='h-20 w-100' />
    </div>
  )
}