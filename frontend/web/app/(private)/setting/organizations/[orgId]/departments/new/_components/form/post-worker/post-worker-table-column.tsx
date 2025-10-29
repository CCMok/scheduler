import { ColumnDef } from "@tanstack/react-table";
import WorkersFormField from "./workers-form-field";

export enum PostWorkerTableId {
  POST_NAME = 'postName',
  WORKER_NAMES = 'workerNames',
}

export type PostWorkerTableData = {
  id: string;
  index: number;
  postTempId: string;
  postName: string;
  workerTempIds: string[];
}

export const columns: ColumnDef<PostWorkerTableData>[] = [
  {
    accessorKey: PostWorkerTableId.POST_NAME,
    header: '職位',
  },
  {
    id: PostWorkerTableId.WORKER_NAMES,
    header: '人員',
    cell: ({ row }) => (
      <WorkersFormField index={row.original.index} />
    ),
  }
]