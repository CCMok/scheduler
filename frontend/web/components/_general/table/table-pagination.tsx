import CustomButton from '@/components/_general/button/custom-button';
import { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props<TData> = {
  table: Table<TData>
}

export default function TablePagination<TData>({
  table,
}: Readonly<Props<TData>>) {
  return (
    <div className="flex justify-end items-center space-x-2">
      <CustomButton
        variant="ghost"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft className="h-4 w-4" />
      </CustomButton>
      <span className="text-sm">
        {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
      </span>
      <CustomButton
        variant="ghost"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight className="h-4 w-4" />
      </CustomButton>
    </div>
  )
}