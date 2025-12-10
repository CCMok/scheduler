'use client'

import LoadingButton from '@/components/_general/button/loading-button';
import { ReactNode, useState } from "react";
import { ChildrenProps } from "@/libs/_general/props/children-props";
import CustomDialog from "./custom-dialog";

type Props = ChildrenProps & {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  title?: string;
  description?: ReactNode;
  onConfirm: () => Promise<void> | void;
  renderConfirmButton?: (isLoading: boolean, onClick: () => Promise<void> | void) => ReactNode;
}

export default function ConfirmDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  onConfirm,
  children,
  renderConfirmButton,
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

  const submitButton = renderConfirmButton 
    ? renderConfirmButton(isLoading, onClickConfirm)
    : (
      <LoadingButton
        isLoading={isLoading}
        onClick={onClickConfirm}
      >
        確定
      </LoadingButton>
    )

  return (
    <CustomDialog
      isOpen={isOpenFinal}
      setIsOpen={setIsOpenFinal}
      trigger={children}
      title={title}
      description={description}
      submitButton={submitButton}
    />
  )
}