'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Trash2 } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { useState } from "react";
import DeletePostWorkerDialog from './delete-post-worker-dialog';

type Props = {
  postId: number;
  postName: string;
  workerId: number;
  workerName: string;
};

export default function PostWorkerTableRowAction({
  postId,
  postName,
  workerId,
  workerName,
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
      <DeletePostWorkerDialog
        postId={postId}
        postName={postName}
        workerId={workerId}
        workerName={workerName}
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      />
    </>
  );
} 