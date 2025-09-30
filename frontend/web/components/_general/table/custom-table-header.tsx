import { TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { flexRender, Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>
}

export default function CustomTableHeader<TData>({
  table,
}: Readonly<Props<TData>>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map(headerGroup => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map(header => (
            <TableHead 
              key={header.id}
              style={{
                width: header.getSize(),
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  )
}