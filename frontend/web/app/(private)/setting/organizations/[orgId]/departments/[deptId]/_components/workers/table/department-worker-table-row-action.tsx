'use client'

import { PATH } from '@/libs/_general/enums/path';
import { ServiceResponse } from '@/libs/_general/models/service-response';
import { deleteWorkerAction } from '@/libs/worker/actions/delete-worker-action';
import { Param } from '@/libs/_general/enums/param';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import DeleteDialog from '@/components/_general/dialog/delete-dialog';
import DeleteDropdownMenuItem from '@/components/_general/dropdown/delete-dropdown-menu-item';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';

type Props = {
  id: number;
  name: string;
};

export default function DepartmentWorkerTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const param = useParams();
  const deptId = Number(param[Param.DEPT_ID]);
  const orgId = Number(param[Param.ORG_ID]);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const editPath = useMemo(() => {
    if (isNaN(deptId) || isNaN(orgId)) return;
    return PATH.setting.organizations.departments.workers(orgId, deptId, id);
  }, [deptId, orgId, id])

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