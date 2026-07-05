'use client'

import CustomButton from "@/components/_general/_custom/button/custom-button"
import { Post, Worker } from "@/external/prisma/generated/client";
import { RosterJoin } from "@/libs/roster/roster";
import { FileDown } from "lucide-react"
import { toast } from "sonner";
import { exportToXLSX } from "./export-utils";

export default function ExportButton({
  roster,
  posts,
  workers,
}: Readonly<{
  roster?: RosterJoin;
  posts: Post[];
  workers: Worker[];
}>) {
  const onClick = async () => {
    if (!roster) return;
    await exportToXLSX(roster, posts, workers)
    toast.success('匯出值班表成功');
  }

  return (
    <CustomButton
      variant="outline"
      onClick={onClick}
      disabled={!roster}
    >
      <FileDown />
      匯出
    </CustomButton>
  )
}