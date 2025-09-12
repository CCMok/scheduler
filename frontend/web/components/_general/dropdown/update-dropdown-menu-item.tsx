import { Edit } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/_general/dropdown/custom-dropdown-menu-item';
import CustomLink from '@/components/_general/link/custom-link';

type Props = {
  href?: string;
}

export default function UpdateDropdownMenuItem({
  href = '',
}: Readonly<Props>) {
  return (
    <CustomDropdownMenuItem asChild>
      <CustomLink href={href}>
        <Edit className="mr-2 h-4 w-4" />
        編輯
      </CustomLink>
    </CustomDropdownMenuItem>
  )
}