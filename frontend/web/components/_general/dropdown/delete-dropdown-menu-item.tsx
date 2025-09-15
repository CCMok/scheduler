'use client'

import { Trash2 } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/_general/dropdown/custom-dropdown-menu-item';

type Props = {
  onClick?: () => (void | Promise<void>);
}

export default function DeleteDropdownMenuItem({
  onClick,
}: Readonly<Props>) {
  return (
    <CustomDropdownMenuItem onClick={onClick} className="text-destructive">
      <Trash2 className="mr-2 h-4 w-4" />
      刪除
    </CustomDropdownMenuItem>
  )
}