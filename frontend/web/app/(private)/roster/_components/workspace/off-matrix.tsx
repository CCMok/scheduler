'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Worker } from '@/external/prisma/generated/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/external/shadcn/components/ui/table'
import { Input } from '@/external/shadcn/components/ui/input'
import { useWorkspaceStore } from './workspace-store-provider'
import DayColumnHeader from './day-column-header'
import { offKey, offSetFromOffs } from '@/libs/roster/workspace/build-persist-request'
import { cn } from '@/external/shadcn/libs/utils'

const WORKER_SEARCH_ID = 'off-matrix-worker-search'

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

  const [query, setQuery] = useState('')
  const [focus, setFocus] = useState({ row: 0, col: 0 })
  const tableRef = useRef<HTMLDivElement>(null)

  const filteredWorkers = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return workers
    return workers.filter((w) => w.name.toLowerCase().includes(q))
  }, [workers, query])

  useEffect(() => {
    setFocus((f) => ({ row: 0, col: f.col }))
  }, [query])

  useEffect(() => {
    setFocus((f) => {
      if (filteredWorkers.length === 0) return { row: 0, col: f.col }
      if (f.row >= filteredWorkers.length) {
        return { row: filteredWorkers.length - 1, col: f.col }
      }
      return f
    })
  }, [filteredWorkers.length])

  useEffect(() => {
    if (readOnly) return
    const onKey = (e: KeyboardEvent) => {
      if (!tableRef.current?.contains(document.activeElement) && document.activeElement !== tableRef.current) {
        return
      }
      if (e.key === 'Escape' && query) {
        e.preventDefault()
        setQuery('')
        return
      }
      const maxRow = filteredWorkers.length - 1
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
        const worker = filteredWorkers[focus.row]
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
  }, [filteredWorkers, timeslots, focus, offSet, toggleOff, readOnly, query])

  if (timeslots.length === 0) {
    return <p className="text-sm text-muted-foreground">請先選擇日期。</p>
  }

  return (
    <div className="flex min-h-0 flex-col gap-1.5">
      <Input
        id={WORKER_SEARCH_ID}
        name={WORKER_SEARCH_ID}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && query) {
            e.preventDefault()
            setQuery('')
          }
        }}
        placeholder="搜尋職員…"
        autoComplete="off"
        className="h-8 max-w-xs text-xs"
        aria-label="搜尋職員"
      />
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
            {filteredWorkers.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={timeslots.length + 1}
                  className="px-2 py-6 text-center text-xs text-muted-foreground"
                >
                  無符合職員
                </TableCell>
              </TableRow>
            ) : (
              filteredWorkers.map((worker, row) => (
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
              ))
            )}
          </TableBody>
        </Table>
        {!readOnly ? (
          <p className="border-t border-border/60 bg-muted/20 px-2 py-1.5 text-[11px] text-muted-foreground">
            ←↑↓→ 移動 · Space 切換 · Y 休假 · N 取消 · Esc 清搜尋 · 拖日欄換整日
          </p>
        ) : null}
      </div>
    </div>
  )
}
