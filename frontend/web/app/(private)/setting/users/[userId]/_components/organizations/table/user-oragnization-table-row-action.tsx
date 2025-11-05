'use client'

import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import { useState } from 'react';
import RemoveAssignmentDialog from '@/components/_general/dialog/remove-assignment-dialog';
import { useParams } from 'next/navigation';
import { Param } from '@/libs/_general/enums/param';
import { deleteUserOrganizationAction } from '@/libs/user-organization/actions/delete-user-organization-action';
import { ServiceResponse } from '@/libs/_general/models/service-response';

type PageParam = {
  [Param.USER_ID]: string;
}

type Props = {
  organizationId: number;
  name?: string;
};

export default function UserOrganizationTableRowAction({
  organizationId,
  name = '',
}: Readonly<Props>) {
  const param = useParams<PageParam>();
  const userId = Number.parseInt(param[Param.USER_ID]);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  if (Number.isNaN(userId)) return <></>

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteUserOrganizationAction({
      userId,
      organizationId,
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
        assigneeEntityName='組織'
        submit={submitDelete}
      />
    </>
  )
} 