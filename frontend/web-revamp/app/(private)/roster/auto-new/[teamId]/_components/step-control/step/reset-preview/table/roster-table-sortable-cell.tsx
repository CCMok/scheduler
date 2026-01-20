"use client";

import { ComponentProps, CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell } from "@/external/shadcn/components/ui/table"
import { cn } from '@/external/shadcn/libs/utils';

export default function RosterTableSortableCell({
  className,
  assignmentId,
  workerName,
  ...props
}: Readonly<ComponentProps<typeof TableCell> & {
  assignmentId: number;
  workerName?: string;
}>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: assignmentId,
    animateLayoutChanges: () => false,
  });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      className={cn(
        'text-center cursor-grab',
        isDragging && 'opacity-50',
        className,
      )}
      {...attributes}
      {...listeners}
      {...props}
    >
      {workerName ?? '-'}
    </TableCell>
  )
}