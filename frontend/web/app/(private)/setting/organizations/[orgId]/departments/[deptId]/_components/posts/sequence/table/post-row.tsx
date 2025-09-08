'use client'

import { useSortable } from "@dnd-kit/sortable";
import { CSSProperties } from "react";
import { CSS } from '@dnd-kit/utilities';
import { Post } from "@/external/prisma-generated";
import { TableCell, TableRow } from "@/external/shadcn/components/ui/table";
import { GripVertical } from "lucide-react";

type Props = {
  post: Post;
}

export default function PostRow({
  post,
}: Readonly<Props>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: post.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className='cursor-grab'
      {...attributes}
      {...listeners}
    >
      <TableCell className='flex items-center space-x-4'>
        <GripVertical size={16}/>
        <span>{post.name}</span>
      </TableCell>
    </TableRow>
  )
}