'use client'

import ActionDropdownMenu from '@/components/_general/dropdown/action-dropdown-menu';

type Props = {
  id: number;
  name: string;
  editPath?: string;
};

export default function DepartmentTableRowAction({
  id,
  name,
  editPath,
}: Readonly<Props>) {
  // TODO: delete
  return (
    <ActionDropdownMenu
      editPath={editPath}
      entityName="部門"
      displayName={name}
    />
  )
} 