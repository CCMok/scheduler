'use client'

import LoadingButton from '@/components/_general/button/loading-button';
import { useState } from "react";
import { ChildrenProps } from "@/libs/_general/props/children-props";
import CustomDialog from "./custom-dialog";

type Props = ChildrenProps & {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  title?: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
}

export default function ConfirmDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  onConfirm,
  children,
}: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState(false)

  const [isOpenDefault, setIsOpenDefault] = useState(false)
  const isOpenFinal = isOpen ?? isOpenDefault
  const setIsOpenFinal = setIsOpen ?? setIsOpenDefault

  const onClickConfirm = async () => {
    setIsLoading(true)

    await onConfirm();

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
          onClick={onClickConfirm}
        >
          確定
        </LoadingButton>
      )}
    />
  )
}