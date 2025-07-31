'use client';

import { Edit, Trash2 } from 'lucide-react';
import CustomDropdownMenuItem from '@/components/dropdown/custom-dropdown-menu-item';
import MoreDropdownMenu from '@/components/dropdown/more-dropdown-menu';

type Props = {
  postId: number;
};

export default function PostTableRowActions({
  postId,
}: Readonly<Props>) {
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit post:', postId);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete post:', postId);
  };

  return (
    <MoreDropdownMenu contentProps={{ align: 'end' }}>
      <CustomDropdownMenuItem onClick={handleEdit}>
        <Edit className="mr-2 h-4 w-4" />
        編輯
      </CustomDropdownMenuItem>
      <CustomDropdownMenuItem onClick={handleDelete} className="text-destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        刪除
      </CustomDropdownMenuItem>
    </MoreDropdownMenu>
  );
} 