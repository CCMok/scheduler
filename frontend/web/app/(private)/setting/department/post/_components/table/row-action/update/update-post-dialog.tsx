'use client';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/external/shadcn/components/ui/alert-dialog";
import FormSubmitButton from "@/components/form/form-submit-button";
import FormRootMessage from "@/components/form/form-root-message";
import UpdatePostForm from "./update-post-form";
import UpdatePostFields from "./update-post-fields";

type Props = {
  postId: number;
  postName: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function UpdatePostDialog({
  postId,
  postName,
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <UpdatePostForm
          setAlertIsOpen={setIsOpen}
          className="space-y-4"
          postId={postId}
          postName={postName}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>編輯職位</AlertDialogTitle>
            <AlertDialogDescription>
              編輯 {postName} 的資料
            </AlertDialogDescription>
          </AlertDialogHeader>
          <UpdatePostFields />
          <FormRootMessage />
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <FormSubmitButton>編輯</FormSubmitButton>
          </AlertDialogFooter>
        </UpdatePostForm>
      </AlertDialogContent>
    </AlertDialog>
  )
}