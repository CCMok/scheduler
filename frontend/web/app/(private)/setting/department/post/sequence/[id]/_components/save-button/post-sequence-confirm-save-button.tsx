'use client'

import LoadingButton from "@/components/button/loading-button";
import { usePostSequenceStore } from "@/components/store/setting/post/sequence/post-sequence-store-provider";
import { useState } from "react";

type Props = {
  setIsAlertDialogOpen: (isAlertDialogOpen: boolean) => void;
}

export default function PostSequenceConfirmSaveButton({
  setIsAlertDialogOpen,
}: Readonly<Props>) {
  const posts = usePostSequenceStore(state => state.posts);

  const [isLoading, setIsLoading] = useState(false);

  const save = async () => {

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