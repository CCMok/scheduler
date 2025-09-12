'use client'

import ContextMenu from '@/components/_general/dropdown/context-menu';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';

type Props = {
  editPath?: string;
};

export default function DepartmentTableRowAction({
  editPath,
}: Readonly<Props>) {
  // TODO: delete
  return (
    <ContextMenu>
      {editPath && <UpdateDropdownMenuItem href={editPath} />}
    </ContextMenu>
  )
} 