'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/external/shadcn/components/ui/dropdown-menu';
import { Button } from '@/external/shadcn/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Post } from '@/external/prisma-generated';

type PostWithDepartment = Post & {
  department: {
    organization: {
      id: number;
      name: string;
    };
    id: number;
    name: string;
  };
};

type Props = {
  post: PostWithDepartment;
};

export default function PostRowActions({
  post,
}: Readonly<Props>) {
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit post:', post.name);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete post:', post.name);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">開啟選單</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          編輯
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          刪除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 