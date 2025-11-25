'use client'

import CustomButton from "@/components/_general/button/custom-button"
import { Save } from "lucide-react"
import { useState } from "react"
import RosterTableSaveDialog from "./roster-table-save-dialog"

type Props = {
  rosterHistoryId: number;
}

export default function RosterTableSaveButton({
  rosterHistoryId,
}: Readonly<Props>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const onClick = () => setIsDialogOpen(true)

  return (
    <>
      <CustomButton onClick={onClick}>
        <Save />
        儲存
      </CustomButton>
      <RosterTableSaveDialog
        rosterHistoryId={rosterHistoryId}
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </>
  )
}