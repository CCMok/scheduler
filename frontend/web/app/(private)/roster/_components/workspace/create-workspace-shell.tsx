'use client'

import { useState } from 'react'
import { Post, Team, Worker } from '@/external/prisma/generated/client'
import { WorkspaceStoreProvider, useWorkspaceStore } from './workspace-store-provider'
import WorkspaceMain from './workspace-main'
import ConfirmLeaveDialog from './confirm-leave-dialog'
import FieldLayout from '@/components/_general/form/field/field-layout'
import Combobox from '@/components/_general/_custom/combobox/combobox'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import { ArrowLeft, UsersRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { isNil } from 'lodash'
import { ROUTE } from '@/libs/_general/route/route-config'
import { searchParamKey } from '../param'

const TEAM_SELECT_ID = 'create-team-select'

function CreateGuidance() {
  const timeslots = useWorkspaceStore((s) => s.timeslots)
  const workingRoster = useWorkspaceStore((s) => s.workingRoster)
  const hasAssigned = workingRoster.some((item) =>
    item.assignments.some((a) => a.workerId != null),
  )

  if (hasAssigned) return null

  const step = timeslots.length === 0 ? 1 : 2

  return (
    <div
      role="status"
      className="rounded-md border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
    >
      {step === 1 ? (
        <p>
          <span className="font-medium text-foreground">① 選日期</span>
          {' — '}在下方日期列揀值班日，再標休假、自動編排。
        </p>
      ) : (
        <p>
          <span className="font-medium text-foreground">② 標休假 → ③ 自動編排</span>
          {' — '}切到「休假」標記休息日，再按「自動編排」。完成後可微調，再「儲存」。
        </p>
      )}
    </div>
  )
}

export default function CreateWorkspaceShell({
  teams,
  posts,
  workers,
  teamId,
}: Readonly<{
  teams: Team[]
  posts: Post[]
  workers: Worker[]
  teamId?: number
}>) {
  const router = useRouter()
  const [cancelCreateOpen, setCancelCreateOpen] = useState(false)
  const [switchTeamOpen, setSwitchTeamOpen] = useState(false)
  const [pendingTeamId, setPendingTeamId] = useState<number | null>(null)

  const requestTeamChange = (id?: number) => {
    if (isNil(id) || teamId === id) return
    setPendingTeamId(id)
    setSwitchTeamOpen(true)
  }

  const confirmSwitchTeam = () => {
    if (pendingTeamId == null) return
    router.push(
      ROUTE.private.roster.new({ [searchParamKey.TEAM_ID]: pendingTeamId }),
    )
  }

  const confirmCancelCreate = () => {
    router.push(
      isNil(teamId)
        ? ROUTE.private.roster.base()
        : ROUTE.private.roster.base({ [searchParamKey.TEAM_ID]: teamId }),
    )
  }

  return (
    <div className="space-y-2">
      <section className="tool-panel">
        <div className="tool-panel-body">
          <div className="toolbar-row items-end">
            <CustomButton
              type="button"
              variant="outline"
              onClick={() => setCancelCreateOpen(true)}
            >
              <ArrowLeft />
              返回列表
            </CustomButton>
            <FieldLayout label="團隊" id={TEAM_SELECT_ID} className="w-(--input-width)">
              <Combobox
                id={TEAM_SELECT_ID}
                placeHolder="請選擇團隊"
                value={teamId}
                setValue={requestTeamChange}
                options={teams}
                getOptionValue={(team) => team.id}
                getOptionDisplay={(team) => team.name}
                icon={<UsersRound />}
              />
            </FieldLayout>
          </div>
        </div>
      </section>

      {!isNil(teamId) ? (
        posts.length === 0 || workers.length === 0 ? (
          <section className="tool-panel">
            <div className="tool-panel-body space-y-3 py-8 text-sm text-muted-foreground">
              <p>
                {posts.length === 0 && workers.length === 0
                  ? '此團隊尚未設定崗位與人員，無法新建值班表。'
                  : posts.length === 0
                    ? '此團隊尚未設定崗位，無法新建值班表。'
                    : '此團隊尚未設定人員，無法新建值班表。'}
              </p>
              <CustomButton
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    ROUTE.private.setting.team.base({
                      [searchParamKey.TEAM_ID]: teamId,
                    }),
                  )
                }
              >
                前往團隊設定
              </CustomButton>
            </div>
          </section>
        ) : (
          <WorkspaceStoreProvider
            key={`${teamId}-new`}
            teamId={teamId}
            postIds={posts.map((p) => p.id)}
          >
            <WorkspaceMain
              posts={posts}
              workers={workers}
              title="新建值班表"
              variant="create"
              guidance={<CreateGuidance />}
            />
          </WorkspaceStoreProvider>
        )
      ) : (
        <section className="tool-panel">
          <div className="tool-panel-body py-8 text-sm text-muted-foreground">
            請選擇團隊以新建值班表。
          </div>
        </section>
      )}

      <ConfirmLeaveDialog
        open={cancelCreateOpen}
        onOpenChange={setCancelCreateOpen}
        title="取消新建"
        description="未存變更會丟失。確定取消新建？"
        confirmLabel="確定"
        onConfirm={confirmCancelCreate}
      />
      <ConfirmLeaveDialog
        open={switchTeamOpen}
        onOpenChange={(open) => {
          setSwitchTeamOpen(open)
          if (!open) setPendingTeamId(null)
        }}
        title="更換團隊"
        description="未存變更會丟失。確定更換團隊？"
        confirmLabel="確定"
        onConfirm={confirmSwitchTeam}
      />
    </div>
  )
}
