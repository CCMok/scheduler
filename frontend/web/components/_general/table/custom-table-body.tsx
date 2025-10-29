import { TableBody, TableCell, TableRow } from "@/external/shadcn/components/ui/table";
import { flexRender, Table } from "@tanstack/react-table";
import { ReactNode } from "react";

type Props<TData> = {
  table: Table<TData>,
  noDataDisplay?: ReactNode,
}

export default function CustomTableBody<TData>({
  table,
  noDataDisplay = '沒有資料',
}: Readonly<Props<TData>>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map(row => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
          >
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id}>
                {flexRender(
                  cell.column.columnDef.cell,
                  cell.getContext(),
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={table.getAllColumns().length}
            className="h-24 text-center"
          >
            {noDataDisplay}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}