import { PATH } from '@/libs/share/_general/utils/path';
import ContextMenu from '@/components/_general/dropdown/context-menu';
import UpdateDropdownMenuItem from '@/components/_general/dropdown/update-dropdown-menu-item';

type Props = {
  id: number;
};

export default function UserTableRowAction({
  id,
}: Readonly<Props>) {
  return (
      <ContextMenu>
        <UpdateDropdownMenuItem href={PATH.setting.users.build(id)} />
      </ContextMenu>
  )
} 