import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/external/shadcn/components/ui/alert-dialog";
import { Dispatch, SetStateAction } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function RosterFilterFormAlertDialog({
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  // TODO on continue

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
          <AlertDialogAction>繼續</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}