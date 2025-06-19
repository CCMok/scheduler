import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import { Dispatch, SetStateAction, useState } from "react";
import { useFormContext } from "react-hook-form";
import useArrangeRosterForm from "./arrange-roster-form-hook";
import LoadingButton from "@/components/button/loading-button";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ArrangeRosterFormAlertDialog({
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  const { setError, getValues } = useFormContext<ArrangeRosterFormInput>()

  const { submit } = useArrangeRosterForm({ setError });

  const [isLoading, setIsLoading] = useState(false)

  const onClickContinue = async () => {
    setIsLoading(true)

    await submit(getValues())
    setIsOpen(false)

    setIsLoading(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要重新生成值勤表嗎?</AlertDialogTitle>
          <AlertDialogDescription>
            重新生成將會覆蓋現有的值勤表，沒有儲存的資料將會遺失，請確認是否繼續。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <LoadingButton isLoading={isLoading} onClick={onClickContinue}>繼續</LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}