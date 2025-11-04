'use client'

import { PATH } from '@/libs/_general/enums/path';
import { ServiceResponse } from '@/libs/_general/models/service-response';
import { deleteWorkerAction } from '@/libs/worker/actions/delete-worker-action';
import { Param } from '@/libs/_general/enums/param';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';

type PageParam = {
  [Param.ORGANIZATION_ID]: string;
}

type Props = {
  id: number;
  name: string;
  departmentId: number;
};

export default function DepartmentWorkerTableRowAction({
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
    return PATH.setting.organizations.departments.workers(organizationId, departmentId, id);
  })()

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteWorkerAction(id)
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
        entityName="人員"
        displayName={name}
        submit={submitDelete}
      />
    </>
  )
} 