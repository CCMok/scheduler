'use client'

import CustomButton from '@/components/_general/button/custom-button';
import { Save } from "lucide-react";
import { useState } from "react";
import PostSequenceSaveDialog from './post-sequence-save-dialog';

export default function PostSequenceSaveButton() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onClick = () => setIsDialogOpen(true);

  return (
    <>
      <CustomButton onClick={onClick}>
        <Save />
        儲存
      </CustomButton>
      <PostSequenceSaveDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      />
    </>
  )
}