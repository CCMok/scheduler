'use client'

import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';
import { deleteDepartmentAction } from '@/libs/department/actions/delete-department-action';
import { ServiceResponse } from '@/libs/_general/models/service-response';
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

  if (isNil(id)) return <></>;

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteDepartmentAction(id);
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