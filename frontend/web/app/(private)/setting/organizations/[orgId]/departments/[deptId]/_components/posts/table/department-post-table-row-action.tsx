'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { deletePostAction } from '@/libs/server/post/actions/delete-post-action';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Param } from '@/libs/share/_general/enums/param';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';

type Props = {
  id: number;
  name: string;
};

export default function DepartmentPostTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const param = useParams();
  const deptId = Number(param[Param.DEPT_ID]);
  const orgId = Number(param[Param.ORG_ID]);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const editPath = useMemo(() => {
    if (isNaN(deptId) || isNaN(orgId)) return;
    return PATH.setting.organizations.departments.posts(orgId, deptId, id);
  }, [deptId, orgId, id])

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostAction({ postId: id });
  }

  return (
    <>
      <ContextMenu>
        <UpdateDropdownMenuItem href={editPath} />
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