'use client';

import { Save } from "lucide-react";
import { useState } from "react";
import CustomButton from '@/components/_general/button/custom-button';
import RosterTableSaveDialog from "./roster-table-save-dialog";

export default function RosterTableSaveButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onClick = () => setIsDialogOpen(true)

  return (
    <>
      <CustomButton onClick={onClick}>
        <Save />
        儲存
      </CustomButton>
      <RosterTableSaveDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </>
  )
}