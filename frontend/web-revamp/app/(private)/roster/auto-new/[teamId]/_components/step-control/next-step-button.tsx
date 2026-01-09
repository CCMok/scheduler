'use client'

import LoadingButton from "@/components/_general/_custom/button/loading-button";
import { ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

export default function NextStepButton({
  setStep,
  onClick,
}: Readonly<{
  setStep: Dispatch<SetStateAction<number>>;
  onClick?: () => void | Promise<void>;
}>) {
  const [isLoading, setIsLoading] = useState(false)
  return (
    <LoadingButton
      className='ml-auto'
      isLoading={isLoading}
      onClick={async (e) => {
        e.preventDefault()
        setIsLoading(true)
        await onClick?.()
        setStep((step) => step + 1)
        setIsLoading(false)
      }}
    >
      下一步
      <ChevronRight />
    </LoadingButton>
  )
}