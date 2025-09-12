'use client'

import ActionDropdownMenu from '@/components/_general/dropdown/action-dropdown-menu';
import { deletePostWorkerAction } from '@/libs/server/post-worker/actions/delete-post-worker-action';
import { Param } from '@/libs/share/_general/enums/param';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { useParams } from 'next/navigation';

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