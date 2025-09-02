'use client'

import { PATH } from '@/libs/share/_general/utils/path';
import ActionDropdownMenu from '@/components/dropdown/action-dropdown-menu';

type Props = {
  id: number;
  name: string;
};

export default function PostTableRowAction({
  id,
  name,
}: Readonly<Props>) {
  // TODO: delete
  return (
    <ActionDropdownMenu
      editPath={PATH.setting.post.build(id)}
      entityName="職位"
      displayName={name}
    />
  )
} 