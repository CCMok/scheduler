'use client'

import ActionDropdownMenu from '@/components/_general/dropdown/action-dropdown-menu';
import { deletePostWorkerAction } from '@/libs/server/post-worker/actions/delete-post-worker-action';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { useParams } from 'next/navigation';

type Props = {
  id: number;
  name: string;
};

export default function WorkerTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const param = useParams();
  const postId = Number(param.postId);

  if (isNaN(postId)) return <></>

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostWorkerAction({ 
      postId,
      workerId: id,
    });
  }

  return (
    <ActionDropdownMenu
      isDelete
      entityName="人員"
      displayName={name}
      submitDelete={submitDelete}
    />
  )
} 