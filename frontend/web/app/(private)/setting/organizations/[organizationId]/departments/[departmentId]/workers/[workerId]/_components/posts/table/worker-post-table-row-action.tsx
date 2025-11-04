'use client'

import { ServiceResponse } from '@/libs/_general/models/service-response';
import { useParams } from 'next/navigation';
import { Param } from '@/libs/_general/enums/param';
import { deletePostWorkerAction } from '@/libs/post-worker/actions/delete-post-worker-action';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import { useState } from 'react';
import RemoveAssignmentDialog from '@/components/_general/dialog/remove-assignment-dialog';

type Props = {
  id: number;
  name: string;
};

export default function WorkerPostTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const param = useParams();
  const workerId = Number(param[Param.WORKER_ID]);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  if (isNaN(workerId)) return <></>

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
        submit={submitDelete}
      />
    </>
  )
} 