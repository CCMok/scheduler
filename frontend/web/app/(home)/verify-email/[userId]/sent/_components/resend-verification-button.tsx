'use client'

import LoadingButton from "@/components/_general/button/loading-button";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { MessageTitle } from "@/libs/_general/enums/message";
import { handleCudResponse } from "@/libs/_general/utils/response-utils";
import { sendEmailVerificationAction } from "@/libs/access/actions/send-email-verification-action"
import { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  userId: number;
}

export default function ResendVerificationButton({
  userId,
}: Readonly<Props>) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const submit = async () => {
    const response = await sendEmailVerificationAction({
      userId,
    })

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('發送驗證電郵' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })
  }

  const onClick = async () => {
    setIsLoading(true)
    await submit()
    setIsLoading(false)
  }

  return (
    <LoadingButton
      onClick={onClick}
      isLoading={isLoading}
    >
      重新發送驗證電郵
    </LoadingButton>
  )
}