'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/dropdown/action-dropdown-menu';

type Props = {
  organizationId: number;
  organizationName: string;
};

export default function OrganizationTableRowAction({
  organizationId,
  organizationName,
}: Readonly<Props>) {
  return (
    <ActionDropdownMenu
      editPath={PATH.setting.organization.build(organizationId)}
      entityName="組織"
      displayName={organizationName}
    />
  )
} 