'use client'

import ActionDropdownMenu from '@/components/_general/dropdown/action-dropdown-menu';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { useParams } from 'next/navigation';
import { Param } from '@/libs/share/_general/enums/param';
import { deletePostWorkerAction } from '@/libs/server/post-worker/actions/delete-post-worker-action';

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

  if (isNaN(workerId)) return <></>

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostWorkerAction({ 
      postId: id,
      workerId,
    });
  }

  return (
    <ActionDropdownMenu
      isDelete
      entityName="職位"
      displayName={name}
      submitDelete={submitDelete}
    />
  )
} 