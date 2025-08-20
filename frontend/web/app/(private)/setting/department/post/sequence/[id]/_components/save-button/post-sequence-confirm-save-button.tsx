'use client'

import LoadingButton from "@/components/button/loading-button";
import { usePostSequenceStore } from "@/components/store/setting/post/sequence/post-sequence-store-provider";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { updatePostSequenceAction } from "@/libs/server/post/actions/update-post-sequence-action";
import { UpdatePostSequenceRequest } from "@/libs/server/post/models/update-post-sequence-request";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success(UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已儲存職位順序',
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