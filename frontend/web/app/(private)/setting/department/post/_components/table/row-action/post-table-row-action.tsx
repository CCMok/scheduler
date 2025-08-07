'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Trash2, Edit } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { useState } from "react";
import DeletePostDialog from './delete-post-dialog';
import UpdatePostDialog from './update/update-post-dialog';
import { useRouter } from 'next/navigation';
import { PATH } from '@/libs/share/_general/utils/path';

type Props = {
  postId: number;
  postName: string;
};

export default function PostTableRowAction({
  postId,
  postName,
}: Readonly<Props>) {
  // TODO: update change from dialog to page
  // TODO: test delete cascade postWorker
  const [isOpenUpdateDialog, setIsOpenUpdateDialog] = useState(false)
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  const router = useRouter();

  const onClickUpdate = () => {
    router.push(PATH.setting.department.post.update.build(postId))
  }

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        <CustomDropdownMenuItem onClick={onClickUpdate}>
          <Edit className="mr-2 h-4 w-4" />
          編輯
        </CustomDropdownMenuItem>
        <CustomDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </CustomDropdownMenuItem>
      </MoreDropdownMenu>
      <UpdatePostDialog
        postId={postId}
        postName={postName}
        isOpen={isOpenUpdateDialog}
        setIsOpen={setIsOpenUpdateDialog}
      />
      <DeletePostDialog
        postId={postId}
        postName={postName}
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      />
    </>
  );
} 