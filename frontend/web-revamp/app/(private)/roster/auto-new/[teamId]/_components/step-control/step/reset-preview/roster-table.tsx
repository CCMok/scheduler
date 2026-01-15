'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/external/shadcn/components/ui/table";
import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useAutoNewRosterStore } from "../store/auto-new-roster-store-provider";

export default function RosterTable() {
  const roster = useAutoNewRosterStore(state => state.roster)

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

  const onDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (!over || !active || active.id === over.id) return;

    // TODO
    // const swappedSchedules = swapSchedule(schedules, over.id, active.id)
    // setSchedules(swappedSchedules);
  }

  const timeslots = roster ? roster[0].assignments.map(assignment => assignment.timeslot) : []

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
    >
      {/* <SortableContext
        items={}
        strategy={rectSwappingStrategy}
      > */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              {timeslots.map((timeslot) => (
                <TableHead key={timeslot}>
                  {timeslot}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {roster.map((rosterPost) => (
              <TableRow key={rosterPost.post.id}>
                <TableCell>{rosterPost.post.name}</TableCell>
                {rosterPost.assignments.map((assignment) => (
                  <TableCell key={assignment.timeslot}>
                    {assignment.worker?.name}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      {/* </SortableContext> */}
    </DndContext>
  )
}