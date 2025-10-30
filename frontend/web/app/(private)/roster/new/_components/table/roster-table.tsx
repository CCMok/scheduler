"use client";

import { useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
  MouseSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSwappingStrategy,
} from '@dnd-kit/sortable';
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
import { format } from 'date-fns';
import { useCreateRosterStore } from '../store/create-roster-store-provider';

export default function RosterTable() {
  const modifiedSchedules = useCreateRosterStore(state => state.modifiedSchedules);
  const setModifiedSchedules = useCreateRosterStore(state => state.setModifiedSchedules);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const days = useMemo(() => {
    return modifiedSchedules.length ? modifiedSchedules[0].arrangements.map(arrangement => arrangement.day.toString()) : []
  }, [modifiedSchedules])

  const arrangementIds = useMemo(() => {
    return modifiedSchedules.flatMap(schedule =>
      schedule.arrangements.map(arrangement => arrangement.id)
    )
  }, [modifiedSchedules])

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || !active || active.id === over.id) return;

    const swappedSchedules = swapSchedule(modifiedSchedules, over.id, active.id)
    setModifiedSchedules(swappedSchedules);
  }

  return (
    // DndContext generate div for drag and drop function, and tbody only accept tr children. So DndContext place outside of table
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <Table>
        <TableCaption>此值班表由系統產生，可以拖放，或連按兩次編輯。</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>職位</TableHead>
            {days.map(day =>
              <TableHead key={day} className='text-center'>{format(day, 'yyyy-MM-dd')}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext items={arrangementIds} strategy={rectSwappingStrategy}>
            {modifiedSchedules.map(schedule => (
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