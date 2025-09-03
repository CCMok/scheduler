'use client'

import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import { ReactNode } from "react";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";

type Props = ChildrenProps & {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  trigger?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  submitButton?: ReactNode;
  renderContent?: (content: ReactNode) => ReactNode;
}

export default function CustomDialog({
  children,
  isOpen,
  setIsOpen,
  trigger,
  title,
  description,
  submitButton,
  renderContent,
}: Readonly<Props>) {
  const content = (
    <div className="space-y-4">
      <AlertDialogHeader>
        {title && <AlertDialogTitle>{title}</AlertDialogTitle>}
        {/* AlertDialogDescription is required. Warning in browser if not set */}
        <AlertDialogDescription>
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      {children}
      <AlertDialogFooter>
        <AlertDialogCancel>取消</AlertDialogCancel>
        {submitButton}
      </AlertDialogFooter>
    </div>
  )

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger}
      <AlertDialogContent>
        {renderContent ? renderContent(content) : content}
      </AlertDialogContent>
    </AlertDialog >
  )
}