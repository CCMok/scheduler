'use client';

import { BrushCleaning } from "lucide-react";
import { AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from '@/components/_general/button/custom-button';
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { useArrangeRosterStore } from "../store/arrange-roster-store-provider";

export default function RosterTableCleanButton() {
  const reset = useArrangeRosterStore(state => state.reset);

  const onContinue = () =>
    reset()

  return (
    <ConfirmDialog
      title='確定要清除值班表嗎?'
      description='清除將會清除所有編排，沒有儲存的資料將會遺失，請確認是否繼續。'
      onContinue={onContinue}
    >
      <AlertDialogTrigger asChild>
        <CustomButton variant='secondary'>
          <BrushCleaning />
          清除
        </CustomButton>
      </AlertDialogTrigger>
    </ConfirmDialog>
  )
}