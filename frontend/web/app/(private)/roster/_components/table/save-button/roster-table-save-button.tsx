'use client';

import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from "@/components/button/custom-button";
import RosterTableSaveConfirmDescription from "./roster-table-save-confirm-description";
import RosterTableSaveConfirmButton from "./roster-table-save-confirm-button";
import { MaxHistoryCountStoreProvider, useMaxHistoryCountStore } from "@/components/store/roster/save/max-history-count-store-provider";
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider";
import { isNil } from "lodash";
import { useRouter } from "next/navigation";

function RosterTableSaveAlertDialog() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const router = useRouter();

  const fetchMaxHistoryCount = useMaxHistoryCountStore(state => state.fetchMaxHistoryCount);
  const generatedScheduleDepartmentId = useArrangeRosterStore(state => state.generatedScheduleDepartmentId);

  useEffect(() => {
    if (isAlertDialogOpen && !isNil(generatedScheduleDepartmentId)) {
      fetchMaxHistoryCount(generatedScheduleDepartmentId, path => router.push(path));
    }
  }, [isAlertDialogOpen, fetchMaxHistoryCount, generatedScheduleDepartmentId]);

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
  );
}

export default function RosterTableSaveButton() {
  return (
    <MaxHistoryCountStoreProvider>
      <RosterTableSaveAlertDialog />
    </MaxHistoryCountStoreProvider>
  )
}