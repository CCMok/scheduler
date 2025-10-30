import { TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { format } from "date-fns";

type Props = {
  days: Date[];
}

export default function RosterTableHeader({
  days,
}: Readonly<Props>) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>職位</TableHead>
        {days.map(day => (
          <TableHead
            key={day.toISOString()}
            className="text-center"
          >
            {format(day, 'yyyy-MM-dd')}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  )
}