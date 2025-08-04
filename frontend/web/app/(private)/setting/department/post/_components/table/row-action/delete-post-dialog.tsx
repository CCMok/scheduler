'use client';

import WarningDialog from '@/components/dialog/warning-dialog';
import { DeletePostRequest } from '@/libs/server/post/models/delete-post-request';
import { deletePostAction } from '@/libs/server/post/actions/delete-post-action';
import useServerResponseHandler from '@/libs/client/_general/hooks/server-response-handler-hook';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { ClientMessageTitle } from '@/libs/client/_general/enums/client-message-enum';
import { ServerResponse } from '@/libs/share/_general/models/server-response';
import { ClientMessage } from '@/libs/client/_general/models/client-message';
import { useRouter } from 'next/navigation';

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
  const { handleServerResponse } = useServerResponseHandler();

  const router = useRouter();

  const onContinue = async () => {
    const request: DeletePostRequest = {
      postId,
    }
    const response = await deletePostAction(request)
    await handleServerResponse(response, onSuccess, onError);
  }

  const onSuccess = async () => {
    toast.success('刪除' + ClientMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '職位已刪除',
    })
    setIsOpen(false)
    router.refresh()
  }

  const onError = (_: ServerResponse, clientMessage: ClientMessage) => {
    toast.error(clientMessage.title, {
      ...SONNER_DEFAULT_OPTIONS,
      description: clientMessage.content,
    })
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