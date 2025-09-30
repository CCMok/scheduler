import { Table } from "@/external/shadcn/components/ui/table";
import TablePagination from '@/components/_general/table/table-pagination';
import { Table as TanStackTable } from "@tanstack/react-table";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import CustomTableHeader from "./custom-table-header";
import CustomTableBody from "./custom-table-body";
import { ReactNode } from "react";

type Props<TData> = ChildrenProps & {
  table: TanStackTable<TData>,
  hasPagination?: boolean,
  noDataDisplay?: ReactNode,
}

export default function CustomTable<TData>({
  table,
  hasPagination = true,
  noDataDisplay,
}: Readonly<Props<TData>>) {
  return (
    <div className='space-y-1'>
      <div className="rounded-md border">
        <Table>
          <CustomTableHeader table={table} />
          <CustomTableBody table={table} noDataDisplay={noDataDisplay} />
        </Table>
      </div >

      {hasPagination && <TablePagination table={table} />}
    </div>
  )
}