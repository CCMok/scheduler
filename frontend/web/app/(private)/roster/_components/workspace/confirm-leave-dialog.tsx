'use client'

import CustomButton from '@/components/_general/_custom/button/custom-button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/external/shadcn/components/ui/dialog'

export default function ConfirmLeaveDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = '確定',
  onConfirm,
}: Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  onConfirm: () => void
}>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <CustomButton variant="outline">返回</CustomButton>
          </DialogClose>
          <CustomButton
            type="button"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            {confirmLabel}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
