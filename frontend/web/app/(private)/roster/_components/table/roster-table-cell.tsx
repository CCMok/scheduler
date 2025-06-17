"use client";

import { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell } from "@/external/shadcn/components/ui/table"

type Props = {
  post: string; 
  day: string;
  person?: string;
}

export default function RosterTableCell({ post, day, person }: Readonly<Props>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${post}-${day}`,
    animateLayoutChanges: () => false,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    textAlign: 'center',
  };

  return (
    <TableCell ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {person ?? ''}
    </TableCell>
  )
}