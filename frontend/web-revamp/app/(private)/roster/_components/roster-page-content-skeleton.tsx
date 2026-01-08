import InputSkeleton from "@/components/_general/_custom/skeleton/input-skeleton";
import TableSkeleton from "@/components/_general/_custom/skeleton/table-skeleton";

export default function RosterPageContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <InputSkeleton />
        <InputSkeleton />
      </div>
      <TableSkeleton />
    </div>
  );
}