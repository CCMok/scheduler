'use client';

import CustomButton from "@/components/button/custom-button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import AddPostForm from "./add-post-form";
import FormSubmitButton from "@/components/form/form-submit-button";
import FormRootMessage from "@/components/form/form-root-message";
import AddPostFields from "./add-post-fields";
import { isNil } from "lodash";
import { useSearchParams } from "next/navigation";
import { SEARCH_PARAM_DEPARTMENT_ID } from "../post-setting-search-param";

export default function AddPostButton() {
  const [isOpen, setIsOpen] = useState(false)

  const searchParams = useSearchParams();
  const departmentId = searchParams.get(SEARCH_PARAM_DEPARTMENT_ID);

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
        <AddPostForm
          setAlertIsOpen={setIsOpen}
          className="space-y-4"
        >
          <AlertDialogHeader>
            <AlertDialogTitle>新增職位</AlertDialogTitle>
            <AlertDialogDescription />
          </AlertDialogHeader>
          <AddPostFields />
          <FormRootMessage />
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <FormSubmitButton>新增</FormSubmitButton>
          </AlertDialogFooter>
        </AddPostForm>
      </AlertDialogContent>
    </AlertDialog>
  );
} 