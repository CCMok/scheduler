import { Edit } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/_general/dropdown/custom-dropdown-menu-item';
import CustomLink from '@/components/_general/link/custom-link';

const UpdateContent = () => (
  <>
    <Edit className="mr-2 h-4 w-4" />
    編輯
  </>
)

type Props = {
  href?: string;
  onClick?: () => (void | Promise<void>);
}

export default function UpdateDropdownMenuItem({
  href,
  onClick,
}: Readonly<Props>) {
  if (href) return (
    <CustomDropdownMenuItem asChild>
      <CustomLink href={href}>
        <UpdateContent />
      </CustomLink>
    </CustomDropdownMenuItem>
  )

  return (
    <CustomDropdownMenuItem onClick={onClick}>
      <UpdateContent />
    </CustomDropdownMenuItem>
  )
}