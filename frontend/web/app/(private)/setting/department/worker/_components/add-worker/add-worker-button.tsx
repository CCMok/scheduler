'use client';

import CustomButton from "@/components/button/custom-button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import FormSubmitButton from "@/components/form/form-submit-button";
import FormRootMessage from "@/components/form/form-root-message";
import { isNil } from "lodash";
import { useWorkerSettingStore } from "@/components/store/setting/worker/worker-setting-store-provider";
import AddWorkerForm from "./add-worker-form";
import AddWorkerFields from "./add-worker-fields";

export default function AddWorkerButton() {
  const [isOpen, setIsOpen] = useState(false)

  const departmentId = useWorkerSettingStore(state => state.departmentId);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <CustomButton
          size='sm'
          disabled={isNil(departmentId)}
        >
          <Plus />
          新增
        </CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AddWorkerForm
          setAlertIsOpen={setIsOpen}
          className="space-y-4"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>新增員工</AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <AddWorkerFields />
          <FormRootMessage />
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <FormSubmitButton>新增</FormSubmitButton>
          </AlertDialogFooter>
        </AddWorkerForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}