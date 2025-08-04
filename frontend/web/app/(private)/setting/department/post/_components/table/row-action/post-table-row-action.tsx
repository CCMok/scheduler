'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Trash2, Edit } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { useState } from "react";
import DeletePostDialog from './delete-post-dialog';

type Props = {
  postId: number;
  postName: string;
};

export default function PostTableRowAction({
  postId,
  postName,
}: Readonly<Props>) {
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false)
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        <CustomDropdownMenuItem onClick={() => setIsOpenEditDialog(true)}>
          <Edit className="mr-2 h-4 w-4" />
          編輯
        </CustomDropdownMenuItem>
        <CustomDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </CustomDropdownMenuItem>
      </MoreDropdownMenu>
      <DeletePostDialog
        postId={postId}
        postName={postName}
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      />
    </>
  );
} 