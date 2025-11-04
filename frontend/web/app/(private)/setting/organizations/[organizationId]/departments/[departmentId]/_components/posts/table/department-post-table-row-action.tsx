'use client'

import { PATH } from '@/libs/_general/enums/path';
import { ServiceResponse } from '@/libs/_general/models/service-response';
import { deletePostAction } from '@/libs/post/actions/delete-post-action';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Param } from '@/libs/_general/enums/param';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';

type PageParam = {
  [Param.ORGANIZATION_ID]: string;
}

type Props = {
  id: number;
  name: string;
  departmentId: number;
};

export default function DepartmentPostTableRowAction({
  id,
  name,
  departmentId,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const param = useParams<PageParam>();
  const organizationId = Number.parseInt(param[Param.ORGANIZATION_ID]);

  const editPath = (() => {
    if (Number.isNaN(organizationId)) {
      console.error(`organizationId is not valid. organizationId: ${organizationId}`)
      return;
    }
    return PATH.setting.organizations.departments.posts(organizationId, departmentId, id);
  })()

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deletePostAction(id);
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