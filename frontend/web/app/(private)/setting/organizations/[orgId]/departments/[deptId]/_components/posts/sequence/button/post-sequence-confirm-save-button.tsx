'use client'

import LoadingButton from '@/components/_general/button/loading-button';
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { updatePostSequenceAction } from "@/libs/post/actions/update-post-sequence-action";
import { UpdatePostSequenceRequest } from "@/libs/post/models/update-post-sequence-request";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { usePostSequenceStore } from "../store/post-sequence-store-provider";
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';
import { MessageTitle } from '@/libs/_general/enums/message';

type Props = {
  setIsAlertDialogOpen: (isAlertDialogOpen: boolean) => void;
}

export default function PostSequenceConfirmSaveButton({
  setIsAlertDialogOpen,
}: Readonly<Props>) {
  const posts = usePostSequenceStore(state => state.posts);

  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false);

  const save = async () => {
    const request: UpdatePostSequenceRequest = {
      postIds: posts.map(post => post.id),
    }

    const response = await updatePostSequenceAction(request);
    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('更新職位順序' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    setIsAlertDialogOpen(false);
  }

  const onClick = async () => {
    setIsLoading(true);
    await save();
    setIsLoading(false);
  }

  return (
    <LoadingButton
      isLoading={isLoading}
      onClick={onClick}
    >
      確定
    </LoadingButton>
  )
}