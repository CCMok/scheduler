'use client';

import LoadingButton from "@/components/button/loading-button";
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider";
import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { AlertDialogHeader, AlertDialogTrigger, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from "@/components/button/custom-button";

export default function RosterTableResetButton() {
  const { initialSchedules, setModifiedSchedules } = useArrangeRosterStore(state => state);

  const [isLoading, setIsLoading] = useState(false);

  const onClickContinue = () => {
    setIsLoading(true);
    reset();
    setIsLoading(false)
  }

  const reset = async () => {
    setModifiedSchedules(initialSchedules)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <CustomButton variant='secondary'>
          <RotateCcw />
          重置
        </CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要重置值班表嗎?</AlertDialogTitle>
          <AlertDialogDescription>
            重置將會覆蓋現有的值班表，沒有儲存的資料將會遺失，請確認是否繼續。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton isLoading={isLoading} onClick={onClickContinue}>繼續</LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}