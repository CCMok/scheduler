import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import CustomCard from "../card/custom-card";
import ButtonSkeleton from "./button-skeleton";

export default function InputCardSkeleton() {
  return (
    <CustomCard
      title={<Skeleton className="h-6 w-32" />}
      footer={<ButtonSkeleton className="ml-auto" />}
    >
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-8 w-50" />
    </CustomCard>
  );
}