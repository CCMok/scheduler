'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Post, Worker } from '@/external/prisma/generated/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/external/shadcn/components/ui/table'
import Combobox from '@/components/_general/_custom/combobox/combobox'
import { useWorkspaceStore } from './workspace-store-provider'
import DayColumnHeader from './day-column-header'
import { swapCellWorkers } from '@/libs/roster/workspace/day-ops'
import { cn } from '@/external/shadcn/libs/utils'
import { X } from 'lucide-react'
import { isNil } from 'lodash'

const CELL_DRAG_TYPE = 'application/x-roster-cell'

export default function AssignGrid({
  posts,
  workers,
  readOnly = false,
}: Readonly<{
  posts: Post[]
  workers: Worker[]
  readOnly?: boolean
}>) {
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const workingRoster = useWorkspaceStore((s) => s.workingRoster)
  const initialRoster = useWorkspaceStore((s) => s.initialRoster)
  const setWorkingRoster = useWorkspaceStore((s) => s.setWorkingRoster)
  const selectedTimeslotId = useWorkspaceStore((s) => s.selectedTimeslotId)
  const assignOnOffConflicts = useWorkspaceStore((s) => s.assignOnOffConflicts)

  const conflictKeys = useMemo(() => {
    const set = new Set<string>()
    for (const c of assignOnOffConflicts) {
      set.add(`${c.postId}-${c.timeslotId}`)
    }
    return set
  }, [assignOnOffConflicts])

  const postMap = useMemo(() => new Map(posts.map((p) => [p.id, p])), [posts])
  const workerMap = useMemo(() => new Map(workers.map((w) => [w.id, w])), [workers])

  const sortedRoster = useMemo(
    () =>
      workingRoster.toSorted((a, b) => {
        const aPos = postMap.get(a.postId)?.displayOrder ?? Infinity
        const bPos = postMap.get(b.postId)?.displayOrder ?? Infinity
        return aPos - bPos
      }),
    [workingRoster, postMap],
  )

  const originalWorkerMap = useMemo(() => {
    const map = new Map<string, number | undefined>()
    for (const item of initialRoster) {
      for (const a of item.assignments) {
        map.set(`${item.postId}-${a.timeslotId}`, a.workerId)
      }
    }
    return map
  }, [initialRoster])

  const [focus, setFocus] = useState({ row: 0, col: 0 })
  const [editing, setEditing] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  const setCellWorker = (postId: number, timeslotId: number, workerId?: number) => {
    if (readOnly) return
    setWorkingRoster(
      workingRoster.map((item) => {
        if (item.postId !== postId) return item
        return {
          ...item,
          assignments: item.assignments.map((a) =>
            a.timeslotId === timeslotId ? { ...a, workerId } : a,
          ),
        }
      }),
    )
  }

  const swapCells = (
    from: { postId: number; timeslotId: number },
    to: { postId: number; timeslotId: number },
  ) => {
    if (readOnly) return
    setWorkingRoster(
      swapCellWorkers({
        workingRoster,
        postIdA: from.postId,
        timeslotIdA: from.timeslotId,
        postIdB: to.postId,
        timeslotIdB: to.timeslotId,
      }),
    )
  }

  const isEditing = !readOnly && editing

  useEffect(() => {
    if (readOnly) return
    const onKey = (e: KeyboardEvent) => {
      if (isEditing) {
        if (e.key === 'Escape') {
          e.preventDefault()
          setEditing(false)
        }
        return
      }
      if (!wrapRef.current?.contains(document.activeElement) && document.activeElement !== wrapRef.current) {
        return
      }
      const maxRow = sortedRoster.length - 1
      const maxCol = timeslots.length - 1
      if (maxRow < 0 || maxCol < 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocus((f) => ({ ...f, row: Math.min(maxRow, f.row + 1) }))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocus((f) => ({ ...f, row: Math.max(0, f.row - 1) }))
      } else if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault()
        setFocus((f) => ({ ...f, col: Math.min(maxCol, f.col + 1) }))
      } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault()
        setFocus((f) => ({ ...f, col: Math.max(0, f.col - 1) }))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        setEditing(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isEditing, sortedRoster.length, timeslots.length, readOnly])

  if (timeslots.length === 0) {
    return <p className="text-sm text-muted-foreground">請先選擇日期並自動編排。</p>
  }

  if (workingRoster.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {readOnly
          ? '尚未有編排結果。'
          : '尚未有編排結果。請先按「自動編排」。'}
      </p>
    )
  }

  return (
    <div
      ref={wrapRef}
      tabIndex={readOnly ? undefined : 0}
      className="roster-grid"
      aria-label={readOnly ? '值班表' : '值班編輯格'}
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="roster-sticky-col h-9 min-w-24 px-2 text-xs">
              職位
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
          {sortedRoster.map((item, row) => (
            <TableRow key={item.postId} className="hover:bg-transparent">
              <TableCell className="roster-sticky-col px-2 py-1 text-xs font-medium">
                {postMap.get(item.postId)?.name}
              </TableCell>
              {timeslots.map((timeslot, col) => {
                const assignment = item.assignments.find((a) => a.timeslotId === timeslot.id)
                const workerId = assignment?.workerId
                const focused = !readOnly && focus.row === row && focus.col === col
                const changed =
                  originalWorkerMap.get(`${item.postId}-${timeslot.id}`) !== workerId
                const isEditingCell = isEditing && focused
                const columnSelected =
                  !readOnly && selectedTimeslotId === timeslot.id
                const hasAssignOnOff = conflictKeys.has(
                  `${item.postId}-${timeslot.id}`,
                )
                const isEmpty = isNil(workerId)

                return (
                  <TableCell
                    key={timeslot.id}
                    className={cn(
                      'group relative roster-day-col p-0.5 text-center text-xs',
                      changed && !hasAssignOnOff && 'roster-cell-changed',
                      columnSelected && 'roster-cell-day-selected',
                      hasAssignOnOff && 'roster-cell-conflict',
                      focused && !isEditingCell && 'ring-2 ring-ring ring-inset',
                      !readOnly && !isEditingCell && 'cursor-grab active:cursor-grabbing',
                    )}
                    draggable={!readOnly && !isEditingCell}
                    onClick={
                      readOnly
                        ? undefined
                        : () => {
                            setFocus({ row, col })
                            setEditing(false)
                          }
                    }
                    onDoubleClick={
                      readOnly
                        ? undefined
                        : () => {
                            setFocus({ row, col })
                            setEditing(true)
                          }
                    }
                    onDragStart={
                      readOnly
                        ? undefined
                        : (e) => {
                            if (isEditingCell) {
                              e.preventDefault()
                              return
                            }
                            e.dataTransfer.setData(
                              CELL_DRAG_TYPE,
                              JSON.stringify({
                                postId: item.postId,
                                timeslotId: timeslot.id,
                              }),
                            )
                            e.dataTransfer.effectAllowed = 'move'
                            setFocus({ row, col })
                            setEditing(false)
                          }
                    }
                    onDragOver={
                      readOnly
                        ? undefined
                        : (e) => {
                            if (![...e.dataTransfer.types].includes(CELL_DRAG_TYPE)) {
                              return
                            }
                            e.preventDefault()
                            e.dataTransfer.dropEffect = 'move'
                          }
                    }
                    onDrop={
                      readOnly
                        ? undefined
                        : (e) => {
                            e.preventDefault()
                            const raw = e.dataTransfer.getData(CELL_DRAG_TYPE)
                            if (!raw) return
                            let from: { postId: number; timeslotId: number }
                            try {
                              from = JSON.parse(raw) as {
                                postId: number
                                timeslotId: number
                              }
                            } catch {
                              return
                            }
                            if (
                              from.postId === item.postId &&
                              from.timeslotId === timeslot.id
                            ) {
                              return
                            }
                            swapCells(from, {
                              postId: item.postId,
                              timeslotId: timeslot.id,
                            })
                            setFocus({ row, col })
                          }
                    }
                  >
                    {isEditingCell ? (
                      <Combobox
                        value={workerId}
                        setValue={(nextWorkerId) => {
                          setCellWorker(item.postId, timeslot.id, nextWorkerId)
                          setEditing(false)
                        }}
                        options={workers}
                        getOptionValue={(w) => w.id}
                        getOptionDisplay={(w) => w.name}
                        isOptional
                        placeHolder="選擇職員"
                        defaultIsOpen
                      />
                    ) : (
                      <div
                        className={cn(
                          'relative flex min-h-8 items-center justify-center',
                          !readOnly && 'px-5',
                        )}
                      >
                        <span
                          className={cn(
                            'truncate',
                            isEmpty && 'roster-cell-empty',
                          )}
                        >
                          {workerId == null
                            ? '—'
                            : (workerMap.get(workerId)?.name ?? '—')}
                        </span>
                        {!readOnly && workerId != null ? (
                          <button
                            type="button"
                            className={cn(
                              'absolute right-0 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm',
                              'text-muted-foreground hover:bg-destructive/15 hover:text-destructive',
                              'opacity-0 transition-opacity focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                              'group-hover:opacity-100',
                              focused && 'opacity-100',
                            )}
                            aria-label="清除指派"
                            title="清除指派"
                            draggable={false}
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              setFocus({ row, col })
                              setCellWorker(item.postId, timeslot.id, undefined)
                              setEditing(false)
                            }}
                          >
                            <X className="size-3.5" aria-hidden />
                          </button>
                        ) : null}
                      </div>
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
          ←↑↓→／Tab 移動 · Enter 選人 · Esc 關閉 · × 清除 · 拖格子對調 · 拖日欄換整日
        </p>
      ) : null}
    </div>
  )
}
