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
  days: Record<string, string | null>;
};

const initialRoster: RosterData[] = [
  { 
    post: 'Host', 
    days: {
      '0': 'Jane',
      '1': null,
      '2': 'Alice',
      '3': null,
      '4': 'Charlie'
    }
  },
  { 
    post: 'Worship Leader', 
    days: {
      '0': 'Jason',
      '1': 'Chow',
      '2': null,
      '3': 'Eve',
      '4': null
    }
  },
];

function SortableCell({ post, day, person }: Readonly<{ post: string; day: string; person: string | null }>) {
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
      {person ?? ''}
    </td>
  );
}

export default function RosterTableSection() {
  const [roster, setRoster] = useState(initialRoster);
  
  // Get available days from the first roster entry
  const days = Object.keys(roster[0]?.days || {}).sort((a, b) => Number(a) - Number(b));

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
              {days.map((day) => (
                <th key={day} style={{ padding: '16px', border: '1px solid #ccc', textAlign: 'center' }}>
                  Day {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SortableContext items={sortableItems} strategy={rectSwappingStrategy}>
              {roster.map((row) => (
                <tr key={row.post}>
                  <td style={{ padding: '16px', border: '1px solid #ccc', fontWeight: 'bold' }}>{row.post}</td>
                  {days.map((day) => (
                    <SortableCell 
                      key={`${row.post}-${day}`}
                      post={row.post} 
                      day={day} 
                      person={row.days[day]} 
                    />
                  ))}
                </tr>
              ))}
            </SortableContext>
          </tbody>
        </table>
      </DndContext>
    </section>
  )
}