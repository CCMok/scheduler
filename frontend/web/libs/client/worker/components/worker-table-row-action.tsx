'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/dropdown/action-dropdown-menu';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { deleteWorkerAction } from '@/libs/server/worker/actions/delete-worker-action';

type Props = {
  id: number;
  name: string;
};

export default function WorkerTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  const submitDelete = async (): Promise<ServiceResponse> => {
    return await deleteWorkerAction({ workerId: id });
  }

  return (
    <ActionDropdownMenu
      editPath={PATH.setting.worker.build(id)}
      isDelete
      entityName="人員"
      displayName={name}
      submitDelete={submitDelete}
    />
  )
} 