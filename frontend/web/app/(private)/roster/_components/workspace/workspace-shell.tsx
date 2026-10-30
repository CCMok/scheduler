'use client'

import { Post, Roster, Team, Worker } from '@/external/prisma/generated/client'
import { RosterJoin } from '@/libs/roster/roster'
import { WorkspaceStoreProvider } from './workspace-store-provider'
import WorkspaceMain from './workspace-main'
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

const TEAM_SELECT_ID = 'team-select'
const ROSTER_SELECT_ID = 'roster-select'

export default function WorkspaceShell({
  teams,
  rosters,
  roster,
  posts,
  workers,
  teamId,
  rosterId,
}: Readonly<{
  teams: Team[]
  rosters: Roster[]
  roster?: RosterJoin
  posts: Post[]
  workers: Worker[]
  teamId?: number
  rosterId?: number
}>) {
  const router = useRouter()

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
    router.push(ROUTE.private.roster.new({ [searchParamKey.TEAM_ID]: teamId }))
  }

  const currentIndex = rosters.findIndex((r) => r.id === rosterId)
  const prevRosterId =
    currentIndex >= 0 && currentIndex < rosters.length - 1
      ? rosters[currentIndex + 1]?.id
      : undefined
  const nextRosterId = currentIndex > 0 ? rosters[currentIndex - 1]?.id : undefined

  return (
    <div className="space-y-2">
      <section className="tool-panel">
        <div className="tool-panel-body">
          <div className="toolbar-row items-end">
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
            <FieldLayout label="值班表" id={ROSTER_SELECT_ID} className="min-w-0 flex-1 sm:max-w-md">
              <div className="flex items-center gap-1.5">
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
                <div className="min-w-0 flex-1">
                  <Combobox
                    placeHolder="請選擇值班表"
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
            <div className="toolbar-row-end">
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
          </div>
        </div>
      </section>

      {!isNil(teamId) && !isNil(roster) ? (
        <WorkspaceStoreProvider
          key={`${teamId}-${roster.id}`}
          teamId={teamId}
          roster={roster}
          postIds={posts.map((p) => p.id)}
        >
          <WorkspaceMain
            posts={posts}
            workers={workers}
            serverRoster={roster}
            title={roster.name || '值班表'}
            variant="edit"
          />
        </WorkspaceStoreProvider>
      ) : (
        <section className="tool-panel">
          <div className="tool-panel-body space-y-3 py-8 text-sm text-muted-foreground">
            {isNil(teamId) ? (
              <p>請選擇團隊以開始編輯值班表。</p>
            ) : (
              <>
                <p>此團隊尚無值班表。建立一份以開始編排。</p>
                <CustomButton type="button" onClick={startNew}>
                  <Plus />
                  新建值班表
                </CustomButton>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
