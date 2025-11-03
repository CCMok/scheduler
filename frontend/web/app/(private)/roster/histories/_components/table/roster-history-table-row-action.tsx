'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import { useState } from 'react';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import { ServiceResponse } from '@/libs/server/_general/models/service-response';
import { format } from 'date-fns';
import { deleteRosterHistoryAction } from '@/libs/server/roster/actions/delete-roster-history-action';

type Props = {
  id: number;
  createdAt: Date;
}

export default function RosterHistoryTableRowAction({
  id,
  createdAt,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteRosterHistoryAction(id);
  }

  return (
    <>
      <ContextMenu>
        <UpdateDropdownMenuItem href={PATH.roster.histories.build(id)} />
        <DeleteDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} />
      </ContextMenu>
      <DeleteDialog
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
        entityName="值班表紀錄"
        displayName={`${format(createdAt, 'yyyy-MM-dd HH:mm:ss')} 的紀錄`}
        submit={submitDelete}
      />
    </>
  )
}