'use client';

import WarningDialog from '@/components/dialog/warning-dialog';
import { DeletePostRequest } from '@/libs/server/post/models/delete-post-request';
import { deletePostAction } from '@/libs/server/post/actions/delete-post-action';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { UiMessageTitle } from '@/libs/share/_general/enums/ui-message';
import { useRouter } from 'next/navigation';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';

type Props = {
  postId: number;
  postName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function DeletePostDialog({
  postId,
  postName,
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  const router = useRouter();

  const onContinue = async () => {
    const request: DeletePostRequest = {
      postId,
    }
    const response = await deletePostAction(request)

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
      description: '職位已刪除',
    })
    setIsOpen(false)
    router.refresh()
  }

  return (
    <WarningDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="刪除職位"
      description={`確定要刪除 ${postName} 嗎？`}
      onContinue={onContinue}
    />
  )
}