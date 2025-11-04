'use client'

import { PATH } from '@/libs/_general/enums/path';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';
import { Role } from '@/libs/role/enums/role';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import { useState } from 'react';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import { deleteOrganizationAction } from '@/libs/organization/actions/delete-organization-action';
import { ServiceResponse } from '@/libs/_general/models/service-response';

type Props = {
  id: number;
  role?: Role;
  name?: string;
};

export default function OrganizationTableRowAction({
  id,
  role,
  name = '',
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const canDelete = role === Role.SYSTEM_ADMIN;

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteOrganizationAction(id);
  }

  return (
    <>
      <ContextMenu>
        <UpdateDropdownMenuItem href={PATH.setting.organizations.build(id)} />
        {canDelete && <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />}
      </ContextMenu>
      {canDelete && <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="機構"
        displayName={name}
        submit={submitDelete}
      />}
    </>
  )
} 