"use client";

import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSwappingStrategy,
} from '@dnd-kit/sortable';
import { useRosterStore } from '@/components/store/roster/roster-store-provider';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/external/shadcn/components/ui/table"
import { swapSchedule } from './roster-table-utils';
import RosterCell from './cell/roster-table-cell';

export default function RosterTable() {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const { postBaseSchedules, isGenerated, setPostBaseSchedules } = useRosterStore(state => state);

  const days = useMemo(() => {
    return postBaseSchedules.length ? postBaseSchedules[0].arrangements.map(arrangement => arrangement.day.toString()) : []
  }, [postBaseSchedules])

  const arrangementIds = useMemo(() => {
    return postBaseSchedules.flatMap(schedule =>
      schedule.arrangements.map(arrangement => arrangement.id)
    )
  }, [postBaseSchedules])

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || !active || active.id === over.id) return;

    const swappedSchedules = swapSchedule(postBaseSchedules, over.id, active.id)
    setPostBaseSchedules(swappedSchedules);
  }

  if (!isGenerated) return <></>;

  return (
    // DndContext generate div for drag and drop function, and tbody only accept tr children. So DndContext place outside of table
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <Table className='table-fixed'>
        <TableCaption>此值勤表由系統產生，可以拖放，或連按兩次編輯。</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>職位</TableHead>
            {days.map(day =>
              <TableHead key={day} className='text-center'>Day {day}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={arrangementIds} strategy={rectSwappingStrategy}>
            {postBaseSchedules.map(schedule => (
              <TableRow key={schedule.post.id}>
                <TableCell className='py-4'>{schedule.post.name}</TableCell>
                {schedule.arrangements.map(arrangement => (
                  <RosterCell
                    key={arrangement.id}
                    arrangement={arrangement}
                  />
                ))}
              </TableRow>
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}