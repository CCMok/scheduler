'use client'

import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';
import { Edit } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import { PATH } from '@/libs/share/_general/utils/path';
import CustomLink from '@/components/link/custom-link';

type Props = {
  organizationId: number;
  organizationName: string;
};

export default function OrganizationTableRowAction({
  organizationId,
  organizationName,
}: Readonly<Props>) {
  // const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        <CustomDropdownMenuItem asChild>
          <CustomLink href={PATH.setting.organization.build(organizationId)}>
            <Edit className="mr-2 h-4 w-4" />
            編輯
          </CustomLink>
        </CustomDropdownMenuItem>
        {/* TODO */}
        {/* <CustomDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </CustomDropdownMenuItem> */}
      </MoreDropdownMenu>
      {/* <DeletePostDialog
        postId={postId}
        postName={postName}
        isOpen={isOpenDeleteDialog}
        setIsOpen={setIsOpenDeleteDialog}
      /> */}
    </>
  );
} 