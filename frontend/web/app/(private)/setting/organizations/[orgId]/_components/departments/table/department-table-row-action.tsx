'use client'

import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';
import { deleteDepartmentAction } from '@/libs/server/department/actions/delete-department-action';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { isNil } from 'lodash';
import { useState } from 'react';

type Props = {
  editPath?: string;
  name?: string;
  id?: number;
};

export default function DepartmentTableRowAction({
  editPath,
  name,
  id,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const submitDelete = async (): Promise<ServiceResponse> => {
    if (isNil(id)) return { status: ServiceResponseStatus.INTERNAL_ERROR };
    return await deleteDepartmentAction({ id });
  }

  return (
    <>
      <ContextMenu>
        {editPath && <UpdateDropdownMenuItem href={editPath} />}
        <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />
      </ContextMenu>
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="部門"
        displayName={name}
        submit={submitDelete}
      />
    </>
  )
} 