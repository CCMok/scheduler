'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/_general/dropdown/action-dropdown-menu';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { deleteWorkerAction } from '@/libs/server/worker/actions/delete-worker-action';
import { Param } from '@/libs/share/_general/enums/param';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

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

  const editPath = useMemo(() => {
    if (isNaN(deptId) || isNaN(orgId)) return;
    return PATH.setting.organizations.departments.workers(orgId, deptId, id);
  }, [deptId, orgId, id])

  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteWorkerAction({ workerId: id });
  }

  return (
    <ActionDropdownMenu
      editPath={editPath}
      isDelete
      entityName="人員"
      displayName={name}
      submitDelete={submitDelete}
    />
  )
} 