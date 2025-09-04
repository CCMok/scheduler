'use client'

import MoreDropdownMenu from '@/components/_general/dropdown/more-dropdown-menu';
import { Edit, Trash2 } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/_general/dropdown/custom-dropdown-menu-item';
import CustomLink from '@/components/_general/link/custom-link';
import { useState } from 'react';
import DeleteDialog from '../dialog/delete-dialog';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';

type Props = {
  editPath?: string;
  isDelete?: boolean;
  entityName?: string;
  displayName?: string;
  submitDelete?: () => Promise<ServiceResponse>;
};

export default function ActionDropdownMenu({
  editPath,
  isDelete,
  entityName,
  displayName,
  submitDelete,
}: Readonly<Props>) {
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false)

  return (
    <>
      <MoreDropdownMenu contentProps={{ align: 'end' }}>
        {editPath && (
          <CustomDropdownMenuItem asChild>
            <CustomLink href={editPath}>
              <Edit className="mr-2 h-4 w-4" />
              編輯
            </CustomLink>
          </CustomDropdownMenuItem>
        )}
        {isDelete && (
          <CustomDropdownMenuItem onClick={() => setIsOpenDeleteDialog(true)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            刪除
          </CustomDropdownMenuItem>
        )}
      </MoreDropdownMenu>
      {isDelete && (
        <DeleteDialog
          isOpen={isOpenDeleteDialog}
          setIsOpen={setIsOpenDeleteDialog}
          entityName={entityName}
          displayName={displayName}
          submit={submitDelete}
        />
      )}
    </>
  );
} 