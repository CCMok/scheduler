'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/_general/dropdown/action-dropdown-menu';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { deletePostAction } from '@/libs/server/post/actions/delete-post-action';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Param } from '@/libs/share/_general/enums/param';

type Props = {
  id: number;
  name: string;
};

export default function PostTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const param = useParams<{ [Param.ORG_ID]: string;[Param.DEPT_ID]: string }>();

  const editPath = useMemo(() => {
    if (!param.deptId) return;
    if (!param.orgId) return PATH.setting.post.build(id);
    return PATH.setting.organizations.departments.posts(param.orgId, param.deptId, id);
  }, [param, id])

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostAction({ postId: id });
  }

  return (
    <ActionDropdownMenu
      editPath={editPath}
      isDelete
      entityName="職位"
      displayName={name}
      submitDelete={submitDelete}
    />
  )
} 