'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Trash2 } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { useState } from "react";

type Props = {
  workerId: number;
  workerName: string;
};

export default function PostWorkerTableRowAction({
  workerId,
  workerName,
}: Readonly<Props>) {
  // TODO
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        <CustomDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </CustomDropdownMenuItem>
      </MoreDropdownMenu>
      {/* <DeletePostDialog
        postId={postId}
        postName={postName}
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      /> */}
    </>
  );
} 