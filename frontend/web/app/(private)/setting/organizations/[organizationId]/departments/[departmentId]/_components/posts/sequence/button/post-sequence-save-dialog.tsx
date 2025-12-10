'use client'

import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { UpdatePostSequenceRequest } from '@/libs/post/models/update-post-sequence-request';
import { usePostSequenceStore } from '../store/post-sequence-store-provider';
import { useRouter } from 'next/navigation';
import { updatePostSequenceAction } from '@/libs/post/actions/update-post-sequence-action';
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';
import { toast } from 'sonner';
import { MessageTitle } from '@/libs/_general/enums/message';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/_general/constants/sonnar-constant';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function PostSequenceSaveDialog({
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  const posts = usePostSequenceStore(state => state.posts);

  const router = useRouter()
  
  const onConfirm = async () => {
    const request: UpdatePostSequenceRequest = {
      postIds: posts.map(post => post.id),
    }

    const response = await updatePostSequenceAction(request);
    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('更新職位順序' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="確定要儲存值班表職位順序嗎?"
      onConfirm={onConfirm}
    />
  )
}