import { ColumnDef } from "@tanstack/react-table";
import WorkerIdFormField from "./worker-id-form-field";
import OffDaysFormField from "./off-days-form-field";
import CustomButton from '@/components/_general/button/custom-button';
import { Minus } from "lucide-react";

export enum OffFilterTableId {
  WORKER = 'worker',
  OFF_DAYS = 'offDays',
  ACTIONS = 'actions',
}

type OffFilterRowData = {
  id: string;
  index: number;
  onRemove: (index: number) => void;
};

export const createOffFilterColumns = (): ColumnDef<OffFilterRowData>[] => [
  {
    id: OffFilterTableId.WORKER,
    header: '人員',
    cell: ({ row }) => (
      <WorkerIdFormField index={row.original.index} />
    ),
  },
  {
    id: OffFilterTableId.OFF_DAYS,
    header: '缺席日',
    cell: ({ row }) => (
      <OffDaysFormField index={row.original.index} />
    ),
  },
  {
    id: OffFilterTableId.ACTIONS,
    header: '動作',
    cell: ({ row }) => (
      <CustomButton
        variant='secondary'
        onClick={() => row.original.onRemove(row.original.index)}
      >
        <Minus />
        移除
      </CustomButton>
    ),
  },
];
