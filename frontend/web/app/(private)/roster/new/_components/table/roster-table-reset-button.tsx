'use client';

import { RotateCcw } from "lucide-react";
import { AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from '@/components/_general/button/custom-button';
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { useArrangeRosterStore } from "../store/arrange-roster-store-provider";

export default function RosterTableResetButton() {
  const initialSchedules = useArrangeRosterStore(state => state.initialSchedules);
  const setModifiedSchedules = useArrangeRosterStore(state => state.setModifiedSchedules);

  const onContinue = () =>
    setModifiedSchedules(initialSchedules)

  return (
    <ConfirmDialog
      title='確定要重置值班表嗎?'
      description='重置將會回復至系統產生的編排，沒有儲存的資料將會遺失，請確認是否繼續。'
      onContinue={onContinue}
    >
      <AlertDialogTrigger asChild>
        <CustomButton variant='secondary'>
          <RotateCcw />
          重置
        </CustomButton>
      </AlertDialogTrigger>
    </ConfirmDialog>
  )
}