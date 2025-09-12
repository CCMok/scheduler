'use client'

import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import { deletePostWorkerAction } from '@/libs/server/post-worker/actions/delete-post-worker-action';
import { Param } from '@/libs/share/_general/enums/param';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { useParams } from 'next/navigation';
import { useState } from 'react';

type Props = {
  id: number;
  name: string;
};

export default function PostWorkerTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const param = useParams();
  const postId = Number(param[Param.POST_ID]);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  if (isNaN(postId)) return <></>

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
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="人員"
        displayName={name}
        submit={submitDelete}
      />
    </>
  )
} 