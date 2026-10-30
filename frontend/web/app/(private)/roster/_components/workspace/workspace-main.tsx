'use client'

import { useState, type ReactNode } from 'react'
import { Post, Worker } from '@/external/prisma/generated/client'
import { RosterJoin } from '@/libs/roster/roster'
import { useWorkspaceStore } from './workspace-store-provider'
import WorkspaceToolbar from './workspace-toolbar'
import WorkspaceModeTabs from './workspace-mode-tabs'
import DateBar from './date-bar'
import OffMatrix from './off-matrix'
import AssignGrid from './assign-grid'
import ConfirmLeaveDialog from './confirm-leave-dialog'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import { Separator } from '@/external/shadcn/components/ui/separator'
import { cn } from '@/external/shadcn/libs/utils'
import { Pencil, X } from 'lucide-react'

export default function WorkspaceMain({
  posts,
  workers,
  serverRoster,
  title,
  variant,
  guidance,
}: Readonly<{
  posts: Post[]
  workers: Worker[]
  serverRoster?: RosterJoin
  title: string
  variant: 'create' | 'edit'
  guidance?: ReactNode
}>) {
  const mode = useWorkspaceStore((s) => s.mode)
  const interaction = useWorkspaceStore((s) => s.interaction)
  const enterEdit = useWorkspaceStore((s) => s.enterEdit)
  const hydrateFromServer = useWorkspaceStore((s) => s.hydrateFromServer)
  const [cancelOpen, setCancelOpen] = useState(false)

  const isEditing = variant === 'create' || interaction === 'edit'
  const showViewEditToggle = variant === 'edit'

  return (
    <>
      <section
        className={cn(
          'tool-panel',
          isEditing && variant === 'edit' && 'border-primary/45 ring-1 ring-primary/20',
        )}
      >
        <div className="tool-panel-header">
          <div className="min-w-0 space-y-0.5">
            <h2 className="truncate text-sm font-semibold">
              {showViewEditToggle && isEditing ? `編輯中 · ${title}` : title}
            </h2>
            {showViewEditToggle ? (
              <p className="text-xs text-muted-foreground">
                {isEditing
                  ? '可修改名稱、日期、休假與編排。儲存後回到檢視；取消則丟棄變更。'
                  : '檢視模式。按「編輯」後才可修改。'}
              </p>
            ) : null}
          </div>
          {showViewEditToggle ? (
            isEditing ? (
              <CustomButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCancelOpen(true)}
              >
                <X />
                取消編輯
              </CustomButton>
            ) : (
              <CustomButton type="button" size="sm" onClick={() => enterEdit()}>
                <Pencil />
                編輯
              </CustomButton>
            )
          ) : null}
        </div>
        <div className="tool-panel-body">
          {guidance}
          {isEditing ? (
            <>
              <WorkspaceToolbar posts={posts} workers={workers} variant={variant} />
              <Separator />
              <DateBar />
              <Separator />
            </>
          ) : (
            <WorkspaceToolbar
              posts={posts}
              workers={workers}
              variant={variant}
              viewOnly
            />
          )}
          <WorkspaceModeTabs />
          {mode === 'off' ? (
            <OffMatrix workers={workers} readOnly={!isEditing} />
          ) : (
            <AssignGrid posts={posts} workers={workers} readOnly={!isEditing} />
          )}
        </div>
      </section>
      {serverRoster ? (
        <ConfirmLeaveDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          title="取消編輯"
          description="未存變更會丟失。確定取消編輯？"
          confirmLabel="確定"
          onConfirm={() => hydrateFromServer(serverRoster)}
        />
      ) : null}
    </>
  )
}
