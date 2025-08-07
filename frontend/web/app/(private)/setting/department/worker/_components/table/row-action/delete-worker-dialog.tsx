'use client';

import WarningDialog from '@/components/dialog/warning-dialog';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';
import { DeleteWorkerRequest } from '@/libs/server/worker/models/delete-worker-request';
import { deleteWorkerAction } from '@/libs/server/worker/actions/delete-worker-action';
import { useRouter } from 'next/navigation';
import { UiMessageTitle } from '@/libs/share/_general/enums/ui-message';
import { useWorkerSettingStore } from '@/components/store/setting/worker/worker-setting-store-provider';
import { UiResponse } from '@/libs/share/_general/models/ui-response';
import { GetWorkersRequest } from '@/libs/server/worker/models/get-workers-request';
import { Worker } from '@/external/prisma-generated';
import { fetchData } from '@/libs/share/_general/utils/fetch';
import { getWorkersAction } from '@/libs/server/worker/actions/get-workers-action';

type Props = {
  workerId: number;
  workerName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function DeleteWorkerDialog({
  workerId,
  workerName,
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  const router = useRouter();

  const departmentId = useWorkerSettingStore(state => state.departmentId);
  const setWorkers = useWorkerSettingStore(state => state.setWorkers);

  const deleteWorker = async (): Promise<UiResponse> => {
    const request: DeleteWorkerRequest = {
      workerId,
    }
    const response = await deleteWorkerAction(request)
    return handleServiceResponse(response, path => router.push(path))
  }

  const fetchWorkers = async (): Promise<Worker[]> => {
    const request: GetWorkersRequest = {
      where: { departmentId },
    }

    return await fetchData(
      async () => await getWorkersAction(request),
      path => router.push(path)
    )
  }

  const onContinue = async () => {
    const uiResponse = await deleteWorker();
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success('刪除' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '人員已刪除',
    })

    const workers = await fetchWorkers()
    setWorkers(workers)

    setIsOpen(false)
  }

  return (
    <WarningDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="刪除員工"
      description={`確定要刪除 ${workerName} 嗎？`}
      onContinue={onContinue}
    />
  )
}