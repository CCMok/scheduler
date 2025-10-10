import { ColumnDef } from "@tanstack/react-table";
import WorkerNameFormField from "./worker-name-form-field";
import RemoveButton from "@/components/_general/button/remove-button";

export type WorkerTableData = {
  id: string;
  index: number;
  onRemove: (index: number) => void;
}

export enum WorkerTableId {
  NAME = 'name',
  ACTIONS = 'actions',
}

export const columns: ColumnDef<WorkerTableData>[] = [
  {
    id: WorkerTableId.NAME,
    header: '人員名稱',
    cell: ({ row }) => (
      <WorkerNameFormField index={row.original.index} />
    ),
  },
  {
    id: WorkerTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <RemoveButton onClick={() => row.original.onRemove(row.original.index)} />
    ),
  },
]