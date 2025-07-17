'use client'

import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import LoadingButton from "@/components/button/loading-button";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  onContinue: () => Promise<void> | void;
}

export default function WarningDialog({
  isOpen,
  setIsOpen,
  title,
  description,
  onContinue,
}: Readonly<Props>) {
  const [isLoading, setIsLoading] = useState(false)

  const onClickContinue = async () => {
    setIsLoading(true)

    await onContinue();

    setIsOpen(false)
    setIsLoading(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
          {description && (
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <LoadingButton
            isLoading={isLoading}
            onClick={onClickContinue}
          >
            繼續
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}