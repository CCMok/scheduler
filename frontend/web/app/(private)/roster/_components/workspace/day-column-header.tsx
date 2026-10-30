'use client'

import { useWorkspaceStore } from './workspace-store-provider'

const DRAG_TYPE = 'application/x-roster-timeslot-id'

export default function DayColumnHeader({
  timeslotId,
  label,
  readOnly = false,
}: Readonly<{
  timeslotId: number
  label: string
  readOnly?: boolean
}>) {
  const selectedTimeslotId = useWorkspaceStore((s) => s.selectedTimeslotId)
  const selectTimeslot = useWorkspaceStore((s) => s.selectTimeslot)
  const swapDays = useWorkspaceStore((s) => s.swapDays)
  const selected = selectedTimeslotId === timeslotId

  if (readOnly) {
    return (
      <span className="block w-full px-1 py-1.5 text-center text-xs font-medium tracking-tight">
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      draggable
      className="roster-day-header"
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
        const el = e.currentTarget
        el.classList.remove('roster-flash')
        void el.offsetWidth
        el.classList.add('roster-flash')
      }}
    >
      {label}
    </button>
  )
}
