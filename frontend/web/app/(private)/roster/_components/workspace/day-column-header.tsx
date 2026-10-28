'use client'

import { useWorkspaceStore } from './workspace-store-provider'
import { cn } from '@/external/shadcn/libs/utils'

const DRAG_TYPE = 'application/x-roster-timeslot-id'

export default function DayColumnHeader({
  timeslotId,
  label,
}: Readonly<{
  timeslotId: number
  label: string
}>) {
  const selectedTimeslotId = useWorkspaceStore((s) => s.selectedTimeslotId)
  const selectTimeslot = useWorkspaceStore((s) => s.selectTimeslot)
  const swapDays = useWorkspaceStore((s) => s.swapDays)
  const selected = selectedTimeslotId === timeslotId

  return (
    <button
      type="button"
      draggable
      className={cn(
        'w-full cursor-grab select-none rounded-sm px-1 py-1 text-center text-xs font-medium outline-none',
        'hover:bg-accent/60 active:cursor-grabbing',
        'focus-visible:ring-2 focus-visible:ring-ring',
        selected && 'bg-primary/15 ring-2 ring-primary ring-inset',
      )}
      aria-pressed={selected}
      aria-label={`日欄 ${label}${selected ? '（已選）' : ''}，拖曳至其他日交換`}
      onClick={() => selectTimeslot(selected ? null : timeslotId)}
      onDragStart={(e) => {
        e.dataTransfer.setData(DRAG_TYPE, String(timeslotId))
        e.dataTransfer.effectAllowed = 'move'
        selectTimeslot(timeslotId)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
      }}
      onDrop={(e) => {
        e.preventDefault()
        const raw = e.dataTransfer.getData(DRAG_TYPE)
        const fromId = Number.parseInt(raw, 10)
        if (Number.isNaN(fromId) || fromId === timeslotId) return
        swapDays(fromId, timeslotId)
      }}
    >
      {label}
    </button>
  )
}
