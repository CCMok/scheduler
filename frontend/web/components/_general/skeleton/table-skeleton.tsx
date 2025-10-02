import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/external/shadcn/components/ui/table";

type Props = {
  rows?: number;
  columns?: number;
};

export default function TableSkeleton({
  rows = 3,
  columns = 4,
}: Readonly<Props>) {
  const headerCells = Array.from({ length: columns }, (_, i) => `header-${i}`);
  const bodyRows = Array.from({ length: rows }, (_, i) => ({
    id: `row-${i}`,
    cells: Array.from({ length: columns }, (_, j) => `cell-${i}-${j}`),
  }));

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {headerCells.map((id) => (
              <TableHead key={id}>
                <Skeleton className="h-4 w-12" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {bodyRows.map((row) => (
            <TableRow key={row.id}>
              {row.cells.map((cellId) => (
                <TableCell key={cellId}>
                  <Skeleton className="h-4 w-50" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}