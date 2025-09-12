'use client'

import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { useParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { deletePostWorkerAction } from '@/libs/server/post-worker/actions/delete-post-worker-action';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import { useState } from 'react';

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
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="職位"
        displayName={name}
        submit={submitDelete}
      />
    </>
  )
} 