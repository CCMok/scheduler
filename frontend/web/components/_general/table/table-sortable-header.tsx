import CustomButton from '@/components/_general/button/custom-button';
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { TableSortDirection } from "@/libs/_general/enums/table-sort-direction";
import { Column } from "@tanstack/react-table";

type Props<TData, TValue> = {
  title: string;
  column: Column<TData, TValue>
}

export default function TableSortableHeader<TData, TValue>({
  title,
  column,
}: Readonly<Props<TData, TValue>>) {
  const onClick = () => {
    if (column.getIsSorted() === TableSortDirection.ASC) {
      column.toggleSorting(true)
      return
    }
    column.toggleSorting(false)
  }

  return (
    <CustomButton
      variant="ghost"
      onClick={onClick}
    >
      {title}
      {column.getIsSorted() === TableSortDirection.ASC && <ArrowUp className="ml-2 h-4 w-4" />}
      {column.getIsSorted() === TableSortDirection.DESC && <ArrowDown className="ml-2 h-4 w-4" />}
      {!column.getIsSorted() && <ChevronsUpDown className="ml-2 h-4 w-4" />}
    </CustomButton>
  )
}