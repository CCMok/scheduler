'use client'

import { useEffect, useState, useTransition } from 'react'
import { Post, Worker } from '@/external/prisma/generated/client'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import LoadingButton from '@/components/_general/_custom/button/loading-button'
import { FileDown, RotateCcw, Save, Undo2, WandSparkles } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useWorkspaceStore } from './workspace-store-provider'
import { autoCreateRosterAction } from '@/libs/roster/create/auto/auto-create-roster-action'
import { autoModifyRosterAction } from '@/libs/roster/update/auto/auto-modify-roster-action'
import { workingRosterToOriginalSchPosts } from '@/libs/roster/update/auto/working-roster-to-original'
import { createRosterAction } from '@/libs/roster/create/create-roster-action'
import { updateRosterAction } from '@/libs/roster/update/update-roster-action'
import { buildTimeslotPersistPayload } from '@/libs/roster/workspace/build-persist-request'
import { isAwayFromBaseline } from '@/libs/roster/workspace/workspace-store'
import { Message } from '@/libs/_general/service/message'
import { exportWorkingToXLSX } from '../export-utils'
import { ROUTE } from '@/libs/_general/route/route-config'
import { searchParamKey } from '../param'
import { Input } from '@/external/shadcn/components/ui/input'

export default function WorkspaceToolbar({
  posts,
  workers,
  variant = 'edit',
  viewOnly = false,
}: Readonly<{
  posts: Post[]
  workers: Worker[]
  variant?: 'create' | 'edit'
  /** View mode: export only, no name / mutate actions */
  viewOnly?: boolean
}>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSaving, setIsSaving] = useState(false)

  const teamId = useWorkspaceStore((s) => s.teamId)
  const rosterId = useWorkspaceStore((s) => s.rosterId)
  const name = useWorkspaceStore((s) => s.name)
  const setName = useWorkspaceStore((s) => s.setName)
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const offs = useWorkspaceStore((s) => s.offs)
  const workingRoster = useWorkspaceStore((s) => s.workingRoster)
  const setArrangeResult = useWorkspaceStore((s) => s.setArrangeResult)
  const markSaved = useWorkspaceStore((s) => s.markSaved)
  const dayUndoStack = useWorkspaceStore((s) => s.dayUndoStack)
  const assignOnOffConflicts = useWorkspaceStore((s) => s.assignOnOffConflicts)
  const canReset = useWorkspaceStore((s) => isAwayFromBaseline(s))
  const undoDayOp = useWorkspaceStore((s) => s.undoDayOp)
  const resetToOriginal = useWorkspaceStore((s) => s.resetToOriginal)

  useEffect(() => {
    if (viewOnly) return
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return
      if (dayUndoStack.length === 0) return
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) {
        return
      }
      e.preventDefault()
      undoDayOp()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dayUndoStack.length, undoDayOp, viewOnly])

  const exportXlsx = async () => {
    if (workingRoster.length === 0) {
      toast.error('尚無可匯出的編排')
      return
    }
    await exportWorkingToXLSX({
      name: name || '值班表',
      timeslotNames: timeslots.map((t) => t.name),
      rosterItems: workingRoster,
      posts,
      workers,
    })
    toast.success('匯出值班表成功')
  }

  if (viewOnly) {
    return (
      <div className="flex flex-wrap gap-2">
        <CustomButton type="button" variant="outline" onClick={exportXlsx}>
          <FileDown />
          匯出
        </CustomButton>
      </div>
    )
  }

  const runArrange = () => {
    if (timeslots.length === 0) {
      toast.error('請先選擇日期')
      return
    }
    startTransition(async () => {
      const hasAssignedWorkers = workingRoster.some((item) =>
        item.assignments.some((a) => a.workerId != null),
      )

      if (hasAssignedWorkers) {
        const response = await autoModifyRosterAction({
          teamId,
          rosterId: rosterId ?? undefined,
          timeslots,
          offs,
          originalRoster: workingRosterToOriginalSchPosts(workingRoster, timeslots),
        })
        if (!response.isSuccess) {
          toast.error(response.message)
          return
        }
        setArrangeResult(response.data.items)
        if (response.data.status === 'FEASIBLE') {
          toast.warning(Message.ROSTER_FEASIBLE_APPROXIMATE)
        } else {
          toast.success('再排成功')
        }
        return
      }

      const response = await autoCreateRosterAction({
        teamId,
        timeslots,
        offs,
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return
      }
      setArrangeResult(response.data.items)
      if (response.data.status === 'FEASIBLE') {
        toast.warning(Message.ROSTER_FEASIBLE_APPROXIMATE)
      } else {
        toast.success('自動編排成功')
      }
    })
  }

  const save = async () => {
    if (!name.trim()) {
      toast.error('請輸入值班表名稱')
      return
    }
    if (timeslots.length === 0) {
      toast.error('請先選擇日期')
      return
    }
    setIsSaving(true)
    try {
      const timeslotPayload = buildTimeslotPersistPayload({
        timeslots,
        workingRoster,
        offs,
      })

      if (rosterId == null) {
        const response = await createRosterAction({
          teamId,
          name: name.trim(),
          timeslots: timeslotPayload,
        })
        if (!response.isSuccess) {
          toast.error(response.message)
          return
        }
        toast.success('已儲存')
        router.replace(
          ROUTE.private.roster.base({
            [searchParamKey.TEAM_ID]: teamId,
            [searchParamKey.ROSTER_ID]: response.data.id,
          }),
        )
        return
      }

      const response = await updateRosterAction({
        id: rosterId,
        name: name.trim(),
        timeslots: timeslotPayload,
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return
      }
      markSaved({
        rosterId,
        serverUpdatedAt: response.data.updatedAt,
      })
      toast.success('已儲存')
      router.refresh()
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="min-w-48 max-w-md space-y-1">
        <label className="text-sm text-muted-foreground" htmlFor="roster-name">
          名稱
        </label>
        <Input
          id="roster-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="值班表名稱"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <LoadingButton
          type="button"
          isLoading={isPending}
          onClick={runArrange}
        >
          <WandSparkles />
          {workingRoster.some((item) =>
            item.assignments.some((a) => a.workerId != null),
          )
            ? '再排'
            : '自動編排'}
        </LoadingButton>
        <LoadingButton
          type="button"
          isLoading={isSaving}
          onClick={save}
          variant={variant === 'create' ? 'outline' : undefined}
        >
          <Save />
          儲存
        </LoadingButton>
        {variant === 'edit' ||
        workingRoster.some((item) =>
          item.assignments.some((a) => a.workerId != null),
        ) ? (
          <CustomButton type="button" variant="outline" onClick={exportXlsx}>
            <FileDown />
            匯出
          </CustomButton>
        ) : null}
        <CustomButton
          type="button"
          variant="outline"
          disabled={dayUndoStack.length === 0}
          onClick={() => undoDayOp()}
        >
          <Undo2 />
          復原
        </CustomButton>
        <CustomButton
          type="button"
          variant="outline"
          disabled={!canReset}
          onClick={() => resetToOriginal()}
        >
          <RotateCcw />
          重設
        </CustomButton>
      </div>
      {assignOnOffConflicts.length > 0 ? (
        <div
          role="status"
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <p>
            警告：有 {assignOnOffConflicts.length}{' '}
            格為休假日仍被指派（儲存仍可用）。可按「再排」嘗試修正。
          </p>
          <CustomButton
            type="button"
            variant="outline"
            className="mt-2"
            disabled={isPending}
            onClick={runArrange}
          >
            <WandSparkles />
            再排修好
          </CustomButton>
        </div>
      ) : null}
    </div>
  )
}
