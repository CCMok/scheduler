'use client'

import { ServiceResponse } from '@/libs/_general/models/service-response';
import { deletePostWorkerAction } from '@/libs/post-worker/actions/delete-post-worker-action';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import { useState } from 'react';
import RemoveAssignmentDialog from '@/components/_general/dialog/remove-assignment-dialog';

type Props = {
  id: number;
  name: string;
  workerId: number;
};

export default function WorkerPostTableRowAction({
  id,
  name,
  workerId,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostWorkerAction({
      postId: id,
      workerId,
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
        assigneeEntityName='職位'
        submit={submitDelete}
      />
    </>
  )
} 