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

export default function WorkerTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const param = useParams<{ [Param.ORG_ID]: string;[Param.DEPT_ID]: string }>();

  const editPath = useMemo(() => {
    if (!param.deptId) return;
    return PATH.setting.organizations.departments.workers(param.orgId, param.deptId, id);
  }, [param, id])

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