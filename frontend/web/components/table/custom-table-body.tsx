import { TableBody, TableCell, TableRow } from "@/external/shadcn/components/ui/table";
import { flexRender, Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>
}

export default function CustomTableBody<TData>({
  table,
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
            沒有資料
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  )
}