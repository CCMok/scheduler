'use client';

import WarningDialog from '@/components/dialog/warning-dialog';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';
import { DeleteWorkerRequest } from '@/libs/server/worker/models/delete-worker-request';
import { deleteWorkerAction } from '@/libs/server/worker/actions/delete-worker-action';
import { useRouter } from 'next/navigation';
import { UiMessageTitle } from '@/libs/share/_general/enums/ui-message';

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

  const onContinue = async () => {
    const request: DeleteWorkerRequest = {
      workerId,
    }
    const response = await deleteWorkerAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
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
    setIsOpen(false)
    router.refresh()
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