'use client';

import { Save } from "lucide-react";
import { useState } from "react";
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from "@/components/button/custom-button";
import RosterTableSaveConfirmDescription from "./roster-table-save-confirm-description";
import RosterTableSaveConfirmButton from "./roster-table-save-confirm-button";

export default function RosterTableSaveButton() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <CustomButton>
          <Save />
          儲存
        </CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要儲存值班表嗎?</AlertDialogTitle>
          <AlertDialogDescription>
            <RosterTableSaveConfirmDescription />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <RosterTableSaveConfirmButton setIsAlertDialogOpen={setIsAlertDialogOpen} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}