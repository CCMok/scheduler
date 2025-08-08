'use client';

import WarningDialog from '@/components/dialog/warning-dialog';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { UiMessageTitle } from '@/libs/share/_general/enums/ui-message';
import { useRouter } from 'next/navigation';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';
import { UiResponse } from '@/libs/share/_general/models/ui-response';
import { DeletePostWorkerRequest } from '@/libs/server/post-worker/models/delete-post-worker-request';
import { deletePostWorkerAction } from '@/libs/server/post-worker/actions/delete-post-worker-action';

type Props = {
  postId: number;
  postName: string;
  workerId: number;
  workerName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function DeletePostWorkerDialog({
  postId,
  postName,
  workerId,
  workerName,
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  const router = useRouter();

  const deletePostWorker = async (): Promise<UiResponse> => {
    const request: DeletePostWorkerRequest = {
      postId,
      workerId,
    }
    const response = await deletePostWorkerAction(request)
    return handleServiceResponse(response, path => router.push(path))
  }

  const onContinue = async () => {
    const uiResponse = await deletePostWorker();
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success('刪除' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: `已從職位 ${postName} 刪除 ${workerName}`,
    })

    setIsOpen(false)

    router.refresh()
  }

  return (
    <WarningDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="刪除職位人員"
      description={`確定要從 ${postName} 刪除 ${workerName} 嗎？`}
      onContinue={onContinue}
    />
  )
}