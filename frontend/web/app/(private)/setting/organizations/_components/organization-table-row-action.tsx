'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/_general/dropdown/action-dropdown-menu';

type Props = {
  id: number;
  name: string;
};

export default function OrganizationTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  // TODO: delete
  return (
    <ActionDropdownMenu
      editPath={PATH.setting.organization.build(id)}
      entityName="組織"
      displayName={name}
    />
  )
} 