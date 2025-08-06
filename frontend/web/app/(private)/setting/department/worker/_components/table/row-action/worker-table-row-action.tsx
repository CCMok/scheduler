'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Trash2, Edit } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { useState } from "react";
import DeleteWorkerDialog from './delete-worker-dialog';
import UpdateWorkerDialog from './update/update-worker-dialog';

type Props = {
  workerId: number;
  workerName: string;
};

export default function WorkerTableRowAction({
  workerId,
  workerName,
}: Readonly<Props>) {
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false)
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        <CustomDropdownMenuItem onClick={() => setIsOpenUpdateDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          編輯
        </CustomDropdownMenuItem>
        <CustomDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </CustomDropdownMenuItem>
      </MoreDropdownMenu>
      <UpdateWorkerDialog
        workerId={workerId}
        workerName={workerName}
        isOpen={isOpenUpdateDialog}
        setIsOpen={setIsOpenUpdateDialog}
      />
      <DeleteWorkerDialog
        workerId={workerId}
        workerName={workerName}
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      />
    </>
  );
}