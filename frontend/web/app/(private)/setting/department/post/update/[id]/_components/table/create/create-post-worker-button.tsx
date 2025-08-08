'use client'

import CustomButton from "@/components/button/custom-button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreatePostWorkerIdFormField from "./create-post-worker-id-form-field";
import CreatePostWorkerForm from "./create-post-worker-form";
import FormRootMessage from "@/components/form/form-root-message";
import FormSubmitButton from "@/components/form/form-submit-button";
import { Worker } from "@/external/prisma-generated";

type Props = {
  departmentId: number,
  workers: Worker[],
  postId: number,
}

export default function CreatePostWorkerButton({
  departmentId,
  workers,
  postId,
}: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <CustomButton size='sm' >
          <Plus />
          新增
        </CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <CreatePostWorkerForm
          setAlertIsOpen={setIsOpen}
          className="space-y-4"
          postId={postId}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>新增職位人員</AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <CreatePostWorkerIdFormField
            departmentId={departmentId}
            existingWorkers={workers}
          />
          <FormRootMessage />
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <FormSubmitButton>新增</FormSubmitButton>
          </AlertDialogFooter>
        </CreatePostWorkerForm>
      </AlertDialogContent>
    </AlertDialog>
  )
}