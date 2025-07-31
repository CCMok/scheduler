import { Table } from "@/external/shadcn/components/ui/table";
import TablePagination from "@/components/table/table-pagination";
import { Table as TanStackTable } from "@tanstack/react-table";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import CustomTableHeader from "./custom-table-header";
import CustomTableBody from "./custom-table-body";

type Props<TData> = ChildrenProps & {
  table: TanStackTable<TData>
}

export default function CustomTable<TData>({
  table,
}: Readonly<Props<TData>>) {
  return (
    <div className='space-y-1'>
      <div className="rounded-md border">
        <Table>
          <CustomTableHeader table={table} />
          <CustomTableBody table={table} />
        </Table>
      </div >

      <TablePagination table={table} />
    </div>
  )
}