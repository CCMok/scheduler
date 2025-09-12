'use client'

import LoadingButton from '@/components/_general/button/loading-button';
import { useState } from "react";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import CustomDialog from "./custom-dialog";

type Props = ChildrenProps & {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  onContinue: () => Promise<void> | void;
}

export default function ConfirmDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  onContinue,
  children,
}: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState(false)

  const [isOpenDefault, setIsOpenDefault] = useState(false)
  const isOpenFinal = isOpen ?? isOpenDefault
  const setIsOpenFinal = setIsOpen ?? setIsOpenDefault

  const onClickContinue = async () => {
    setIsLoading(true)

    await onContinue();

    setIsOpenFinal(false)
    setIsLoading(false)
  }

  return (
    <CustomDialog
      isOpen={isOpenFinal}
      setIsOpen={setIsOpenFinal}
      trigger={children}
      title={title}
      description={description}
      submitButton={(
        <LoadingButton
          isLoading={isLoading}
          onClick={onClickContinue}
        >
          確定
        </LoadingButton>
      )}
    />
  )
}