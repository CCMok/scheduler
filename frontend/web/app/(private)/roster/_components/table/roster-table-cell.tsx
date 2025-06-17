"use client";

import { CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableCell } from "@/external/shadcn/components/ui/table"
import { Arrangement } from '@/libs/server/roster/model/roster';
import { cn } from '@/external/shadcn/libs/utils';

type Props = {
  arrangement: Arrangement;
}

export default function RosterTableCell({ arrangement }: Readonly<Props>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: arrangement.id,
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
      )}
      {...attributes}
      {...listeners}
    >
      {arrangement.worker?.name ?? ''}
    </TableCell>
  )
}