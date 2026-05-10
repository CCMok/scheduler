'use client'

import CustomButton from "@/components/_general/_custom/button/custom-button";
import LoadingButton from "@/components/_general/_custom/button/loading-button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/external/shadcn/components/ui/dialog";
import { cn } from "@/external/shadcn/libs/utils";
import { deleteWorkerAction } from "@/libs/worker/delete/delete-worker-action";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const description = '刪除後將移除相關設定，值班表將不會顯示該職員，且無法恢復。'

export default function DeleteWorkerSection({
  className,
  workerId,
  onSuccess,
}: Readonly<{
  className?: string;
  workerId: number;
  onSuccess?: () => void;
}>) {
  const router = useRouter();

  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    const response = await deleteWorkerAction(workerId)
    if (!response.isSuccess) {
      toast.error(response.message)
      return;
    }
    toast.success('刪除職員成功')
    // refresh with new data
    router.refresh();
    setIsOpenConfirmDialog(false)
    onSuccess?.()
  }
  return (
    <>
      <Card className={cn('border-destructive bg-destructive/10', className)}>
        <CardHeader>
          <CardTitle>刪除職員</CardTitle>
          <CardDescription className='text-destructive-foreground'>{description}</CardDescription>
        </CardHeader>
        <CardFooter>
          <CustomButton
            className="[&>*]:w-full lg:[&>*]:w-fit"
            variant='destructive'
            onClick={() => setIsOpenConfirmDialog(true)}
          >
            <Trash2 />
            確定
          </CustomButton>
        </CardFooter>
      </Card>
      <Dialog open={isOpenConfirmDialog} onOpenChange={setIsOpenConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>刪除職員</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <p>{description}</p>
          <DialogFooter>
            <DialogClose asChild>
              <CustomButton variant="outline">返回</CustomButton>
            </DialogClose>
            <LoadingButton
              variant='destructive'
              isLoading={isSubmitting}
              onClick={async (e) => {
                e.preventDefault()
                setIsSubmitting(true)
                await submit()
                setIsSubmitting(false)
              }}
            >
              確定
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}