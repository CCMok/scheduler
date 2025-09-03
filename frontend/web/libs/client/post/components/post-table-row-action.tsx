'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/dropdown/action-dropdown-menu';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { deletePostAction } from '@/libs/server/post/actions/delete-post-action';

type Props = {
  id: number;
  name: string;
};

export default function PostTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostAction({ postId: id });
  }

  return (
    <ActionDropdownMenu
      editPath={PATH.setting.post.build(id)}
      isDelete
      entityName="職位"
      displayName={name}
      submitDelete={submitDelete}
    />
  )
} 