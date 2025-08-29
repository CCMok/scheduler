'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Trash2, Edit } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { useState } from "react";
import DeletePostDialog from './delete-post-dialog';
import { PATH } from '@/libs/share/_general/utils/path';
import CustomLink from '@/components/link/custom-link';

type Props = {
  postId: number;
  postName: string;
};

export default function PostTableRowAction({
  postId,
  postName,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        <CustomDropdownMenuItem asChild>
          <CustomLink href={PATH.setting.post.build(postId)}>
            <Edit className="mr-2 h-4 w-4" />
            編輯
          </CustomLink>
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