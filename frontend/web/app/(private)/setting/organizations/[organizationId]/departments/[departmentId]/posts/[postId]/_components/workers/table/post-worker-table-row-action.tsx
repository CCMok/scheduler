'use client'

import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import { deletePostWorkerAction } from '@/libs/post-worker/actions/delete-post-worker-action';
import { ServiceResponse } from '@/libs/_general/models/service-response';
import { useState } from 'react';
import RemoveAssignmentDialog from '@/components/_general/dialog/remove-assignment-dialog';

type Props = {
  id: number;
  name: string;
  postId: number;
};

export default function PostWorkerTableRowAction({
  id,
  name,
  postId,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostWorkerAction({
      postId,
      workerId: id,
    });
  }

  return (
    <>
      <ContextMenu>
        <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />
      </ContextMenu>
      <RemoveAssignmentDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        displayName={name}
        assigneeEntityName='人員'
        submit={submitDelete}
      />
    </>
  )
} 