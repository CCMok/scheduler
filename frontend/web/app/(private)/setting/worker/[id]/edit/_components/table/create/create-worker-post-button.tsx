'use client'

import CustomButton from "@/components/button/custom-button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateWorkerPostIdFormField from "./create-worker-post-id-form-field";
import CreateWorkerPostForm from "./create-worker-post-form";
import FormRootMessage from "@/components/form/form-root-message";
import FormSubmitButton from "@/components/form/form-submit-button";
import { useWorkerUpdateStore } from "@/app/(private)/setting/worker/[id]/edit/_components/store/worker-update-store-provider";

export default function CreateWorkerPostButton() {
  const [isOpen, setIsOpen] = useState(false)

  const workerId = useWorkerUpdateStore(state => state.workerId)
  const departmentId = useWorkerUpdateStore(state => state.departmentId)
  const posts = useWorkerUpdateStore(state => state.posts)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <CustomButton size='sm' >
          <Plus />
          新增
        </CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <CreateWorkerPostForm
          setAlertIsOpen={setIsOpen}
          className="space-y-4"
          workerId={workerId}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>新增職位人員</AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <CreateWorkerPostIdFormField
            departmentId={departmentId}
            existingPosts={posts}
          />
          <FormRootMessage />
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <FormSubmitButton>新增</FormSubmitButton>
          </AlertDialogFooter>
        </CreateWorkerPostForm>
      </AlertDialogContent>
    </AlertDialog>
  )
}