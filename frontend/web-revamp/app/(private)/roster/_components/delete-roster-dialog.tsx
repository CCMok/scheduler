'use client'

import CustomButton from "@/components/_general/_custom/button/custom-button";
import LoadingButton from "@/components/_general/_custom/button/loading-button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/external/shadcn/components/ui/dialog";
import { deleteRosterAction } from "@/libs/roster/delete/delete-roster-action";
import { isNil } from "lodash";
import { Trash } from "lucide-react";
import { useState } from "react";
import { buildRosterUrl } from "./param";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteRosterDialog({
  id,
  teamId,
  rosterName,
}: Readonly<{
  id?: number;
  teamId?: number;
  rosterName?: string;
}>) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const submit = async () => {
    if (isNil(id)) return;
    const response = await deleteRosterAction(id);
    if (!response.isSuccess) {
      toast.error(response.message);
      return;
    }

    toast.success('刪除值班表成功');
    router.push(buildRosterUrl(teamId));
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <CustomButton
          variant="destructive"
          disabled={isNil(id)}
        >
          <Trash />
          刪除
        </CustomButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>刪除值班表</DialogTitle>
          <DialogDescription>
            確定要刪除值班表{rosterName ? `「${rosterName}」` : ''}嗎？刪除後將無法復原。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <CustomButton variant="outline">返回</CustomButton>
          </DialogClose>
          <LoadingButton
            variant='destructive'
            isLoading={isLoading}
            onClick={async () => {
              setIsLoading(true);
              await submit();
              setIsLoading(false);
            }}
          >
            確定
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}