'use client'

import { useState } from 'react'
import { Post, Roster, Team, Worker } from '@/external/prisma/generated/client'
import { RosterJoin } from '@/libs/roster/roster'
import { WorkspaceStoreProvider, useWorkspaceStore } from './workspace-store-provider'
import WorkspaceToolbar from './workspace-toolbar'
import DateBar from './date-bar'
import OffMatrix from './off-matrix'
import AssignGrid from './assign-grid'
import ConflictDialog from './conflict-dialog'
import FieldLayout from '@/components/_general/form/field/field-layout'
import Combobox from '@/components/_general/_custom/combobox/combobox'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  UsersRound,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { isNil } from 'lodash'
import { ROUTE } from '@/libs/_general/route/route-config'
import { searchParamKey } from '../param'
import DeleteRosterDialog from '../delete-roster-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card'
import { Separator } from '@/external/shadcn/components/ui/separator'
import { clearRosterDraft, draftKeyForNew } from '@/libs/roster/draft/roster-draft'

const TEAM_SELECT_ID = 'team-select'
const ROSTER_SELECT_ID = 'roster-select'

function WorkspaceMain({
  posts,
  workers,
  serverRoster,
}: Readonly<{
  posts: Post[]
  workers: Worker[]
  serverRoster?: RosterJoin
}>) {
  const mode = useWorkspaceStore((s) => s.mode)

  return (
    <>
      {serverRoster ? <ConflictDialog serverRoster={serverRoster} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>值班工作區</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <WorkspaceToolbar posts={posts} workers={workers} />
          <Separator />
          <DateBar />
          <Separator />
          {mode === 'off' ? (
            <OffMatrix workers={workers} />
          ) : (
            <AssignGrid posts={posts} workers={workers} />
          )}
        </CardContent>
      </Card>
    </>
  )
}

export default function WorkspaceShell({
  teams,
  rosters,
  roster,
  posts,
  workers,
  teamId,
  rosterId,
  isNewRoster = false,
}: Readonly<{
  teams: Team[]
  rosters: Roster[]
  roster?: RosterJoin
  posts: Post[]
  workers: Worker[]
  teamId?: number
  rosterId?: number
  /** True when URL is `rosterId=new` — distinct from “no roster selected”. */
  isNewRoster?: boolean
}>) {
  const router = useRouter()
  /** Bumped on explicit「新建」so provider remounts even if already on create URL. */
  const [newWorkspaceEpoch, setNewWorkspaceEpoch] = useState(0)

  const setTeamId = (id?: number) => {
    if (isNil(id) || teamId === id) return
    router.push(ROUTE.private.roster.base({ [searchParamKey.TEAM_ID]: id }))
  }

  const setRosterId = (id?: number) => {
    if (isNil(teamId) || isNil(id) || rosterId === id) return
    router.push(
      ROUTE.private.roster.base({
        [searchParamKey.TEAM_ID]: teamId,
        [searchParamKey.ROSTER_ID]: id,
      }),
    )
  }

  const startNew = () => {
    if (isNil(teamId)) return
    // Explicit new = blank sheet. Refresh while on create still restores draft.
    clearRosterDraft(draftKeyForNew(teamId))
    setNewWorkspaceEpoch((n) => n + 1)
    router.push(
      ROUTE.private.roster.base({
        [searchParamKey.TEAM_ID]: teamId,
        [searchParamKey.ROSTER_ID]: 'new',
      }),
    )
  }

  const currentIndex = rosters.findIndex((r) => r.id === rosterId)
  const prevRosterId =
    currentIndex >= 0 && currentIndex < rosters.length - 1
      ? rosters[currentIndex + 1]?.id
      : undefined
  const nextRosterId = currentIndex > 0 ? rosters[currentIndex - 1]?.id : undefined

  return (
    <div className="space-y-2">
      <Card>
        <CardContent className="space-y-3">
          <div className="flex flex-row flex-wrap gap-3">
            <FieldLayout label="團隊" id={TEAM_SELECT_ID} className="w-(--input-width)">
              <Combobox
                id={TEAM_SELECT_ID}
                placeHolder="請選擇團隊"
                value={teamId}
                setValue={setTeamId}
                options={teams}
                getOptionValue={(team) => team.id}
                getOptionDisplay={(team) => team.name}
                icon={<UsersRound />}
              />
            </FieldLayout>
            <FieldLayout label="值班表" id={ROSTER_SELECT_ID} className="w-(--input-width)">
              <div className="flex items-center gap-2">
                <CustomButton
                  variant="outline"
                  size="icon"
                  disabled={isNil(prevRosterId)}
                  onClick={() => {
                    if (isNil(teamId) || isNil(prevRosterId)) return
                    router.replace(
                      ROUTE.private.roster.base({
                        [searchParamKey.TEAM_ID]: teamId,
                        [searchParamKey.ROSTER_ID]: prevRosterId,
                      }),
                    )
                  }}
                  aria-label="上一個值班表"
                >
                  <ChevronLeft />
                </CustomButton>
                <div className="flex-1">
                  <Combobox
                    placeHolder={isNewRoster ? '新建（未存）' : '請選擇值班表'}
                    value={rosterId}
                    setValue={setRosterId}
                    options={rosters}
                    getOptionValue={(r) => r.id}
                    getOptionDisplay={(r) => r.name}
                    icon={<Calendar />}
                  />
                </div>
                <CustomButton
                  variant="outline"
                  size="icon"
                  disabled={isNil(nextRosterId)}
                  onClick={() => {
                    if (isNil(teamId) || isNil(nextRosterId)) return
                    router.replace(
                      ROUTE.private.roster.base({
                        [searchParamKey.TEAM_ID]: teamId,
                        [searchParamKey.ROSTER_ID]: nextRosterId,
                      }),
                    )
                  }}
                  aria-label="下一個值班表"
                >
                  <ChevronRight />
                </CustomButton>
              </div>
            </FieldLayout>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-3">
            <CustomButton type="button" onClick={startNew} disabled={isNil(teamId)}>
              <Plus />
              新建值班表
            </CustomButton>
            <DeleteRosterDialog
              id={rosterId}
              teamId={teamId}
              rosterName={roster?.name}
            />
          </div>
        </CardContent>
      </Card>

      {!isNil(teamId) ? (
        <WorkspaceStoreProvider
          key={
            isNewRoster
              ? `${teamId}-new-${newWorkspaceEpoch}`
              : `${teamId}-${roster?.id ?? 'none'}`
          }
          teamId={teamId}
          roster={isNewRoster ? undefined : roster}
          postIds={posts.map((p) => p.id)}
        >
          <WorkspaceMain
            posts={posts}
            workers={workers}
            serverRoster={isNewRoster ? undefined : roster}
          />
        </WorkspaceStoreProvider>
      ) : (
        <Card>
          <CardContent className="py-8 text-sm text-muted-foreground">
            請選擇團隊以開始編輯值班表。
          </CardContent>
        </Card>
      )}
    </div>
  )
}
