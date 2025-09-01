'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/dropdown/action-dropdown-menu';

type Props = {
  id: number;
  name: string;
};

export default function DepartmentTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  // TODO: delete
  return (
    <ActionDropdownMenu
      editPath={PATH.setting.department.build(id)}
      entityName="部門"
      displayName={name}
    />
  )
} 