"use client";

import React, { useState } from 'react';
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

type RosterData = {
  post: string;
  day0: string;
  day1: string;
};

const initialRoster: RosterData[] = [
  { post: 'Host', day0: 'Jane', day1: 'Foon' },
  { post: 'Worship Leader', day0: 'Jason', day1: 'Chow' },
];

function SortableCell({ post, day, person }: { post: string; day: 'day0' | 'day1'; person: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `${post}-${day}` });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    border: '1px solid #ccc',
    padding: '16px',
    textAlign: 'center',
  };

  return (
    <td ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {person}
    </td>
  );
}

export default function RosterTableSection() {
  const [roster, setRoster] = useState(initialRoster);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortableItems = roster.flatMap(row => [`${row.post}-day0`, `${row.post}-day1`]);

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

        const activeDayKey = activeDay as keyof Omit<RosterData, 'post'>;
        const overDayKey = overDay as keyof Omit<RosterData, 'post'>;

        const activeValue = newRoster[activeRowIndex][activeDayKey];
        const overValue = newRoster[overRowIndex][overDayKey];

        newRoster[activeRowIndex][activeDayKey] = overValue;
        newRoster[overRowIndex][overDayKey] = activeValue;
        
        return newRoster;
      });
    }
  }

  return (
    <section>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead className='bg-secondary'>
            <tr>
              <th style={{ padding: '16px', border: '1px solid #ccc', textAlign: 'left' }}>Post</th>
              <th style={{ padding: '16px', border: '1px solid #ccc', textAlign: 'center' }}>Day 0</th>
              <th style={{ padding: '16px', border: '1px solid #ccc', textAlign: 'center' }}>Day 1</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext items={sortableItems} strategy={rectSwappingStrategy}>
              {roster.map((row) => (
                <tr key={row.post}>
                  <td style={{ padding: '16px', border: '1px solid #ccc', fontWeight: 'bold' }}>{row.post}</td>
                  <SortableCell post={row.post} day="day0" person={row.day0} />
                  <SortableCell post={row.post} day="day1" person={row.day1} />
                </tr>
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
    </section>
  )
}