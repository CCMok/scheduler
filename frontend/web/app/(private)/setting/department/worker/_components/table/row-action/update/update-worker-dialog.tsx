'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/external/shadcn/components/ui/alert-dialog";
import FormSubmitButton from "@/components/form/form-submit-button";
import FormRootMessage from "@/components/form/form-root-message";
import UpdateWorkerForm from "./update-worker-form";
import UpdateWorkerFields from "./update-worker-fields";

type Props = {
  workerId: number;
  workerName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function UpdateWorkerDialog({
  workerId,
  workerName,
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <UpdateWorkerForm
          setAlertIsOpen={setIsOpen}
          className="space-y-4"
          workerId={workerId}
          workerName={workerName}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>編輯員工</AlertDialogTitle>
            <AlertDialogDescription>
              編輯 {workerName} 的資料
            </AlertDialogDescription>
          </AlertDialogHeader>
          <UpdateWorkerFields />
          <FormRootMessage />
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <FormSubmitButton>編輯</FormSubmitButton>
          </AlertDialogFooter>
        </UpdateWorkerForm>
      </AlertDialogContent>
    </AlertDialog>
  )
}