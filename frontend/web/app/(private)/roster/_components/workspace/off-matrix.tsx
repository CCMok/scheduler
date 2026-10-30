'use client'

import { useEffect, useRef, useState } from 'react'
import { Worker } from '@/external/prisma/generated/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/external/shadcn/components/ui/table'
import { useWorkspaceStore } from './workspace-store-provider'
import DayColumnHeader from './day-column-header'
import { offKey, offSetFromOffs } from '@/libs/roster/workspace/build-persist-request'
import { cn } from '@/external/shadcn/libs/utils'

export default function OffMatrix({
  workers,
  readOnly = false,
}: Readonly<{
  workers: Worker[]
  readOnly?: boolean
}>) {
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const offs = useWorkspaceStore((s) => s.offs)
  const toggleOff = useWorkspaceStore((s) => s.toggleOff)
  const selectedTimeslotId = useWorkspaceStore((s) => s.selectedTimeslotId)
  const offSet = offSetFromOffs(offs)

  const [focus, setFocus] = useState({ row: 0, col: 0 })
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (readOnly) return
    const onKey = (e: KeyboardEvent) => {
      if (!tableRef.current?.contains(document.activeElement) && document.activeElement !== tableRef.current) {
        return
      }
      const maxRow = workers.length - 1
      const maxCol = timeslots.length - 1
      if (maxRow < 0 || maxCol < 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocus((f) => ({ ...f, row: Math.min(maxRow, f.row + 1) }))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocus((f) => ({ ...f, row: Math.max(0, f.row - 1) }))
      } else if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault()
        setFocus((f) => ({ ...f, col: Math.min(maxCol, f.col + 1) }))
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setFocus((f) => ({ ...f, col: Math.max(0, f.col - 1) }))
      } else if (e.key === ' ' || e.key === 'y' || e.key === 'Y' || e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        const worker = workers[focus.row]
        const timeslot = timeslots[focus.col]
        if (!worker || !timeslot) return
        const isOff = offSet.has(offKey(worker.id, timeslot.id))
        if (e.key === 'n' || e.key === 'N') {
          if (isOff) toggleOff(worker.id, timeslot.id)
          return
        }
        if (e.key === 'y' || e.key === 'Y') {
          if (!isOff) toggleOff(worker.id, timeslot.id)
          return
        }
        toggleOff(worker.id, timeslot.id)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [workers, timeslots, focus, offSet, toggleOff, readOnly])

  if (timeslots.length === 0) {
    return <p className="text-sm text-muted-foreground">請先選擇日期。</p>
  }

  return (
    <div
      ref={tableRef}
      tabIndex={readOnly ? undefined : 0}
      className="roster-grid"
      aria-label="休假矩陣"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="roster-sticky-col h-9 min-w-24 px-2 text-xs">
              職員
            </TableHead>
            {timeslots.map((t) => (
              <TableHead
                key={t.id}
                className="roster-day-col h-9 p-0.5 align-bottom"
              >
                <DayColumnHeader
                  timeslotId={t.id}
                  label={t.name}
                  readOnly={readOnly}
                />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {workers.map((worker, row) => (
            <TableRow key={worker.id} className="hover:bg-transparent">
              <TableCell className="roster-sticky-col px-2 py-1 text-xs font-medium">
                {worker.name}
              </TableCell>
              {timeslots.map((timeslot, col) => {
                const isOff = offSet.has(offKey(worker.id, timeslot.id))
                const focused = !readOnly && focus.row === row && focus.col === col
                const columnSelected =
                  !readOnly && selectedTimeslotId === timeslot.id
                return (
                  <TableCell
                    key={timeslot.id}
                    className={cn(
                      'roster-day-col p-0.5 text-center',
                      columnSelected && 'roster-cell-day-selected',
                    )}
                  >
                    {readOnly ? (
                      <span
                        className={cn(
                          'inline-flex h-8 w-full items-center justify-center rounded-sm text-xs',
                          isOff
                            ? 'roster-off-on'
                            : 'roster-cell-empty bg-transparent',
                        )}
                        aria-label={`${worker.name} ${timeslot.name} ${isOff ? '休假' : '非休假'}`}
                      >
                        {isOff ? '休' : '—'}
                      </span>
                    ) : (
                      <button
                        type="button"
                        className={cn(
                          'h-8 w-full rounded-sm text-xs transition-colors',
                          isOff
                            ? 'roster-off-on'
                            : 'bg-transparent text-muted-foreground hover:bg-muted/60',
                          focused && 'ring-2 ring-ring ring-inset',
                        )}
                        aria-pressed={isOff}
                        aria-label={`${worker.name} ${timeslot.name} 休假`}
                        onClick={() => {
                          setFocus({ row, col })
                          toggleOff(worker.id, timeslot.id)
                        }}
                        onFocus={() => setFocus({ row, col })}
                      >
                        {isOff ? '休' : '—'}
                      </button>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!readOnly ? (
        <p className="border-t border-border/60 bg-muted/20 px-2 py-1.5 text-[11px] text-muted-foreground">
          ←↑↓→ 移動 · Space 切換 · Y 休假 · N 取消 · 拖日欄換整日
        </p>
      ) : null}
    </div>
  )
}
