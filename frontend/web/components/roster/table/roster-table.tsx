'use client'

import { Table, TableBody, TableCaption } from "@/external/shadcn/components/ui/table";
import RosterTableHeader from "./roster-table-header";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { rectSwappingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { swapSchedule } from "@/app/(private)/roster/new/_components/table/roster-table-utils";

type Props = {
  days: Date[];
}

export default function RosterTable({
  days,
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

  const ids: number[] = []; // TODO

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || !active || active.id === over.id) return;

    // TODO
    // const swappedSchedules = swapSchedule(modifiedSchedules, over.id, active.id)
    // setModifiedSchedules(swappedSchedules);
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
            {/* TODO */}
            <></>
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  )
}