"use client";

import FieldLayout from "@/components/_general/form/field/field-layout";
import { FieldGroup } from "@/external/shadcn/components/ui/field";
import type { Post, Roster, Team, Worker } from "@/external/prisma/generated/client";
import Combobox from "@/components/_general/_custom/combobox/combobox";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Pencil,
  UsersRound,
  WandSparkles,
} from "lucide-react";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import CustomLink from "@/components/_general/_custom/link/custom-link";
import { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, } from "@/external/shadcn/components/ui/card";
import { searchParamKey } from "./param";
import { Separator } from "@/external/shadcn/components/ui/separator";
import DeleteRosterDialog from "./delete-roster-dialog";
import { RosterJoin } from "@/libs/roster/roster";
import RosterTableSection from "./roster-table-section";
import { ROUTE } from "@/libs/_general/route/route-config";
import OffTable from "@/components/off/table/off-table";
import ExportButton from "./export-button";

const TEAM_SELECT_ID = 'team-select';
const ROSTER_SELECT_ID = 'roster-select';

export default function RosterPageContent({
  teams,
  rosters,
  roster,
  posts,
  workers,
  teamId,
  rosterId,
}: Readonly<{
  teams: Team[];
  rosters: Roster[];
  roster?: RosterJoin;
  posts: Post[];
  workers: Worker[];
  teamId?: number;
  rosterId?: number;
}>) {
  const router = useRouter();

  const setTeamId = useCallback((id?: number) => {
    if (isNil(id) || teamId === id) return;
    router.push(ROUTE.private.roster.base({ [searchParamKey.TEAM_ID]: id }));
  }, [router, teamId]);

  const setRosterId = useCallback((id?: number) => {
    if (isNil(teamId) || isNil(id) || rosterId === id) return;
    router.push(ROUTE.private.roster.base({
      [searchParamKey.TEAM_ID]: teamId,
      [searchParamKey.ROSTER_ID]: id,
    }));
  }, [router, teamId, rosterId]);

  const currentIndex = rosters.findIndex((r) => r.id === rosterId);
  const prevRosterId = currentIndex >= 0 && currentIndex < rosters.length - 1 ? rosters[currentIndex + 1]?.id : undefined;
  const nextRosterId = currentIndex > 0 ? rosters[currentIndex - 1]?.id : undefined;

  const goPrev = useCallback(() => {
    if (isNil(teamId) || isNil(prevRosterId)) return;
    router.replace(ROUTE.private.roster.base({
      [searchParamKey.TEAM_ID]: teamId,
      [searchParamKey.ROSTER_ID]: prevRosterId,
    }));
  }, [router, teamId, prevRosterId]);

  const goNext = useCallback(() => {
    if (isNil(teamId) || isNil(nextRosterId)) return;
    router.replace(ROUTE.private.roster.base({
      [searchParamKey.TEAM_ID]: teamId,
      [searchParamKey.ROSTER_ID]: nextRosterId,
    }));
  }, [router, teamId, nextRosterId]);

  return (
    <div className="space-y-2">
      <Card>
        <CardContent className='space-y-3'>
          <FieldGroup className='flex-row flex-wrap'>
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
                  id={ROSTER_SELECT_ID}
                  variant="outline"
                  size="icon"
                  disabled={isNil(prevRosterId)}
                  onClick={goPrev}
                  aria-label="上一個值班表"
                  title="上一個值班表"
                >
                  <ChevronLeft />
                </CustomButton>
                <div className="flex-1">
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
                  onClick={goNext}
                  aria-label="下一個值班表"
                  title="下一個值班表"
                >
                  <ChevronRight />
                </CustomButton>
              </div>
            </FieldLayout>
          </FieldGroup>
          <Separator />
          <div className="flex flex-wrap gap-3">
            <CustomButton asChild variant="default">
              <CustomLink
                href={ROUTE.private.roster.autoNew(teamId ?? '')}
                isDisabled={isNil(teamId)}
              >
                <WandSparkles />
                自動編排
              </CustomLink>
            </CustomButton>
            <CustomButton asChild variant="outline">
              <CustomLink
                href={ROUTE.private.roster.edit(rosterId ?? '')}
                isDisabled={isNil(rosterId)}
              >
                <Pencil />
                更改
              </CustomLink>
            </CustomButton>
            <ExportButton
              roster={roster}
              posts={posts}
              workers={workers}
            />
            <DeleteRosterDialog
              id={rosterId}
              teamId={teamId}
              rosterName={roster?.name}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            值班表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RosterTableSection
            roster={roster}
            posts={posts}
            workers={workers}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>休假時段</CardTitle>
        </CardHeader>
        <CardContent>
          <OffTable
            offs={roster ? roster.timeslots.map(t => ({
              timeslotId: t.id,
              workerIds: t.offWorkers.map(ow => ow.workerId),
            })) : []}
            timeslots={roster ? roster.timeslots : []}
            workers={workers}
          />
        </CardContent>
      </Card>
    </div>
  );
}
