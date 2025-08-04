'use client';

import WarningDialog from '@/components/dialog/warning-dialog';
import { DeletePostRequest } from '@/libs/server/post/models/delete-post-request';
import { deletePostAction } from '@/libs/server/post/actions/delete-post-action';
import useServerResponseHandler from '@/libs/client/_general/hooks/server-response-handler-hook';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { ClientMessageTitle } from '@/libs/client/_general/enums/client-message-enum';
import { ServerResponse, SuccessResponse } from '@/libs/share/_general/models/server-response';
import { ClientMessage } from '@/libs/client/_general/models/client-message';
import { useCallback } from 'react';
import { Post } from '@/external/prisma-generated';
import { SYSTEM_ERROR_CLIENT_MESSAGE } from '@/libs/client/_general/utils/server-response-handler';
import { useFetchPosts } from '@/libs/client/post/hooks/use-fetch-posts';
import { usePostSettingStore } from '@/components/store/setting/post/post-setting-store-provider';

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
  
  const setPosts = usePostSettingStore(state => state.setPosts);
  const departmentId = usePostSettingStore(state => state.departmentId);

  const onFetchPostSuccess = useCallback((response: SuccessResponse<Post[]>) => {
    setPosts(response.data)
  }, [setPosts])

  const onFetchPostError = useCallback((_: ServerResponse, clientMessage: ClientMessage) => {
    toast.error(SYSTEM_ERROR_CLIENT_MESSAGE.title, {
      ...SONNER_DEFAULT_OPTIONS,
      description: clientMessage.content,
    })
  }, [])

  const { fetchPosts } = useFetchPosts(onFetchPostSuccess, onFetchPostError);

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
    await fetchPosts({ departmentId: Number(departmentId) })
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