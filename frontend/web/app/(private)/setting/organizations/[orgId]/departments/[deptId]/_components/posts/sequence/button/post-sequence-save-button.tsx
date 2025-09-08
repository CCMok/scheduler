'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { AlertDialog, AlertDialogTrigger, AlertDialogTitle, AlertDialogDescription, AlertDialogHeader, AlertDialogContent, AlertDialogCancel, AlertDialogFooter } from "@/external/shadcn/components/ui/alert-dialog";
import { Save } from "lucide-react";
import { useState } from "react";
import PostSequenceConfirmSaveButton from "./post-sequence-confirm-save-button";

export default function PostSaveButton() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <CustomButton>
          <Save />
          儲存順序
        </CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要儲存值班表職位順序嗎?</AlertDialogTitle>
          <AlertDialogDescription />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <PostSequenceConfirmSaveButton setIsAlertDialogOpen={setIsAlertDialogOpen} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}