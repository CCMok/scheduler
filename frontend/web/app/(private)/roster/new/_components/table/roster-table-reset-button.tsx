'use client';

import { RotateCcw } from "lucide-react";
import { AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from '@/components/_general/button/custom-button';
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { useCreateRosterStore } from "../store/create-roster-store-provider";

type Props = {
  description?: string;
}

export default function RosterTableResetButton({
  description,
}: Readonly<Props>) {
  const initialSchedules = useCreateRosterStore(state => state.initialSchedules);
  const setModifiedSchedules = useCreateRosterStore(state => state.setModifiedSchedules);

  const onContinue = () =>
    setModifiedSchedules(initialSchedules)

  return (
    <ConfirmDialog
      title='確定要重置值班表嗎?'
      description={description}
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