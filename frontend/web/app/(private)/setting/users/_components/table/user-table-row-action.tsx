'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';
import { Role } from '@/libs/share/_general/enums/role';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import { useState } from 'react';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import { isNil } from 'lodash';
// import { deleteUserAction } from '@/libs/server/user/actions/delete-user-action';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { ServiceResponseStatus } from '@/libs/share/_general/enums/service-response-status';
// TODO
type Props = {
  id: number;
  role?: Role;
  // name?: string;
};

export default function UserTableRowAction({
  id,
  role,
  // name = '',
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const canDelete = role === Role.SYSTEM_ADMIN;

  // const submitDelete = async (): Promise<ServiceResponse> => {
  //   // if (isNil(id)) return { status: ServiceResponseStatus.INTERNAL_ERROR };
  //   // return await deleteUserAction({ id });
  // }

  return (
    <>
      <ContextMenu>
        {/* <UpdateDropdownMenuItem href={PATH.setting.users.build(id)} />
        {canDelete && <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />} */}
      </ContextMenu>
      {canDelete && <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="組織"
        // displayName={name}
        // submit={submitDelete}
      />}
    </>
  )
} 