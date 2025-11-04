'use client'

import { Table, TableBody, TableCaption } from "@/external/shadcn/components/ui/table";
import RosterTableHeader from "./roster-table-header";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { swapSchedule } from "@/components/roster/table/utils/roster-table-utils";
import { PostBaseSchedule } from "@/libs/roster/models/schedule";
import { useMemo } from "react";
import RosterTableRow from "./roster-table-row";
import { Worker } from "@/external/prisma-generated";

type Props = {
  days: Date[];
  schedules: PostBaseSchedule[];
  setSchedules: (schedules: PostBaseSchedule[]) => void;
  workers: Worker[];
}

export default function RosterTable({
  days,
  schedules,
  setSchedules,
  workers,
}: Readonly<Props>) {
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

  const ids: number[] = useMemo(() => {
    return schedules.flatMap(schedule =>
      schedule.arrangements.map(arrangement => arrangement.id)
    )
  }, [schedules])

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || !active || active.id === over.id) return;

    const swappedSchedules = swapSchedule(schedules, over.id, active.id)
    setSchedules(swappedSchedules);
  }

  const setSchedule = (schedule: PostBaseSchedule) => {
    const newSchedules = schedules.map(oldSchedule => ({
      ...(oldSchedule.post.id === schedule.post.id ? schedule : oldSchedule),
    }))
    setSchedules(newSchedules);
  }

  return (
    // DndContext generate div for drag and drop function, and tbody only accept tr children. So DndContext place outside of table
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      <Table>
        <TableCaption>可以拖放，或連按兩次編輯。</TableCaption>
        <RosterTableHeader days={days} />
        <TableBody>
          <SortableContext items={ids} strategy={rectSwappingStrategy}>
            {schedules.map(schedule => (
              <RosterTableRow
                key={schedule.post.id}
                schedule={schedule}
                setSchedule={setSchedule}
                workers={workers}
              />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  )
}