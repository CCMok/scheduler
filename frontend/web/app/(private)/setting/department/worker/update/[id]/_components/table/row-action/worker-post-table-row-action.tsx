'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Trash2 } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { useState } from "react";
import DeleteWorkerPostDialog from './delete-worker-post-dialog';

type Props = {
  workerId: number;
  workerName: string;
  postId: number;
  postName: string;
};

export default function WorkerPostTableRowAction({
  workerId,
  workerName,
  postId,
  postName,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        <CustomDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </CustomDropdownMenuItem>
      </MoreDropdownMenu>
      <DeleteWorkerPostDialog
        workerId={workerId}
        workerName={workerName}
        postId={postId}
        postName={postName}
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      />
    </>
  );
} 