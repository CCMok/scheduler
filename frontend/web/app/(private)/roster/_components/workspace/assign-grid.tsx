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
import { cn } from '@/external/shadcn/libs/utils'
import { isNil } from 'lodash'

export default function AssignGrid({
  posts,
  workers,
}: Readonly<{
  posts: Post[]
  workers: Worker[]
}>) {
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const workingRoster = useWorkspaceStore((s) => s.workingRoster)
  const initialRoster = useWorkspaceStore((s) => s.initialRoster)
  const setWorkingRoster = useWorkspaceStore((s) => s.setWorkingRoster)

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (editing) {
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
  }, [editing, sortedRoster.length, timeslots.length])

  if (timeslots.length === 0) {
    return <p className="text-sm text-muted-foreground">請先選擇日期並自動編排。</p>
  }

  if (workingRoster.length === 0) {
    return <p className="text-sm text-muted-foreground">尚未有編排結果。請先按「自動編排」。</p>
  }

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      className="outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label="值班編輯格"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>職位</TableHead>
            {timeslots.map((t) => (
              <TableHead key={t.id} className="text-center text-xs">
                {t.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRoster.map((item, row) => (
            <TableRow key={item.postId}>
              <TableCell>{postMap.get(item.postId)?.name}</TableCell>
              {timeslots.map((timeslot, col) => {
                const assignment = item.assignments.find((a) => a.timeslotId === timeslot.id)
                const focused = focus.row === row && focus.col === col
                const changed =
                  originalWorkerMap.get(`${item.postId}-${timeslot.id}`) !== assignment?.workerId
                const isEditingCell = editing && focused

                return (
                  <TableCell
                    key={timeslot.id}
                    className={cn(
                      'min-w-28 p-1 text-center',
                      changed && 'bg-accent/40',
                      focused && !isEditingCell && 'ring-2 ring-ring ring-inset',
                    )}
                    onClick={() => {
                      setFocus({ row, col })
                      setEditing(false)
                    }}
                    onDoubleClick={() => {
                      setFocus({ row, col })
                      setEditing(true)
                    }}
                  >
                    {isEditingCell ? (
                      <Combobox
                        value={assignment?.workerId}
                        setValue={(workerId) => {
                          setCellWorker(item.postId, timeslot.id, workerId)
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
                      <span>
                        {isNil(assignment?.workerId)
                          ? '—'
                          : (workerMap.get(assignment.workerId)?.name ?? '—')}
                      </span>
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-muted-foreground">
        方向鍵／Tab 移動；Enter 開啟選擇；Esc 關閉。
      </p>
    </div>
  )
}
