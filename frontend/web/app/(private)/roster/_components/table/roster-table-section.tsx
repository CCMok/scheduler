"use client";

import React, { useState, useEffect, CSSProperties } from 'react';
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
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRosterStore } from '@/components/store/roster/roster-store-provider';
import { ArrangeRosterResponse } from '@/libs/server/roster/model/arrange-roster-response';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/external/shadcn/components/ui/table"

type RosterData = {
  post: string;
  days: Record<string, string | null>;
};

function mapResponseToRosterData(response: ArrangeRosterResponse | undefined): RosterData[] {
  if (!response) return [];

  return response.schedules.map(schedule => {
    const days: Record<string, string | null> = {};

    // Initialize all days with null
    const maxDay = Math.max(...schedule.arrangements.map(arr => arr.day));
    for (let i = 0; i <= maxDay; i++) {
      days[i.toString()] = null;
    }

    // Fill in the worker names
    schedule.arrangements.forEach(arrangement => {
      days[arrangement.day.toString()] = arrangement.worker?.name ?? null;
    });

    return {
      post: schedule.post.name,
      days
    };
  });
}

function SortableCell({ post, day, person }: Readonly<{ post: string; day: string; person: string | null }>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${post}-${day}` });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    textAlign: 'center',
  };

  return (
    <td ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {person ?? ''}
    </td>
  );
}

export default function RosterTableSection() {
  const { response } = useRosterStore(state => state);
  const [roster, setRoster] = useState<RosterData[]>([]);

  useEffect(() => {
    const mappedData = mapResponseToRosterData(response);
    setRoster(mappedData);
  }, [response]);

  // Get available days from the first roster entry
  const days = roster.length > 0
    ? Object.keys(roster[0].days).sort((a, b) => Number(a) - Number(b))
    : [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortableItems = roster.flatMap(row =>
    days.map(day => `${row.post}-${day}`)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = active.id.toString();
      const overId = over.id.toString();

      const activePost = activeId.substring(0, activeId.lastIndexOf('-'));
      const activeDay = activeId.substring(activeId.lastIndexOf('-') + 1);

      const overPost = overId.substring(0, overId.lastIndexOf('-'));
      const overDay = overId.substring(overId.lastIndexOf('-') + 1);

      setRoster(currentRoster => {
        const newRoster = JSON.parse(JSON.stringify(currentRoster)) as RosterData[];

        const activeRowIndex = newRoster.findIndex(r => r.post === activePost);
        const overRowIndex = newRoster.findIndex(r => r.post === overPost);

        if (activeRowIndex === -1 || overRowIndex === -1) {
          return currentRoster;
        }

        const activeValue = newRoster[activeRowIndex].days[activeDay];
        const overValue = newRoster[overRowIndex].days[overDay];

        newRoster[activeRowIndex].days[activeDay] = overValue;
        newRoster[overRowIndex].days[overDay] = activeValue;

        return newRoster;
      });
    }
  }

  if (days.length === 0) {
    return <div>No roster data available</div>;
  }

  return (
    <section>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Table className='table-fixed'>
          <TableCaption>此值勤表由系統產生，可以拖放調整排班</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>職位</TableHead>
              {days.map(day =>
                <TableHead key={day} className='text-center'>Day {day}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <SortableContext items={sortableItems} strategy={rectSwappingStrategy}>
              {roster.map(row => (
                <TableRow key={row.post}>
                  <TableCell className='py-4'>{row.post}</TableCell>
                  {days.map(day => (
                    <SortableCell
                      key={`${row.post}-${day}`}
                      post={row.post}
                      day={day}
                      person={row.days[day]}
                    />
                  ))}
                </TableRow>
              ))}
            </SortableContext>
          </TableBody>
        </Table>
      </DndContext>
    </section>
  );
}