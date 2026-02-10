"use client";

import FieldLayout from "@/components/_general/form/field/field-layout";
import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field";
import type { Post, Roster, Team, Worker } from "@/external/prisma/generated/client";
import Combobox from "@/components/_general/_custom/combobox/combobox";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Users,
  WandSparkles,
} from "lucide-react";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import CustomLink from "@/components/_general/_custom/link/custom-link";
import { Path } from "@/libs/_general/path/path";
import { isNil } from "lodash";
import { RosterJoin } from "@/libs/roster/roster";
import RosterTable from "./roster-table/roster-table";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { SearchParamKey } from "./param";

function buildRosterUrl(teamId?: number, rosterId?: number): string {
  const params = new URLSearchParams();
  if (!isNil(teamId)) params.set(SearchParamKey.TEAM_ID, String(teamId));
  if (!isNil(rosterId)) params.set(SearchParamKey.ROSTER_ID, String(rosterId));
  const q = params.toString();
  return q ? `${Path.ROSTER}?${q}` : Path.ROSTER;
}

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
    router.push(buildRosterUrl(id));
  }, [router, teamId]);

  const setRosterId = useCallback((id?: number) => {
    if (isNil(teamId) || isNil(id) || rosterId === id) return;
    router.push(buildRosterUrl(teamId, id));
  }, [router, teamId, rosterId]);

  const currentIndex = rosters.findIndex((r) => r.id === rosterId);
  const prevRosterId = currentIndex >= 0 && currentIndex < rosters.length - 1 ? rosters[currentIndex + 1]?.id : undefined;
  const nextRosterId = currentIndex > 0 ? rosters[currentIndex - 1]?.id : undefined;

  const goPrev = useCallback(() => {
    if (isNil(teamId) || isNil(prevRosterId)) return;
    router.replace(buildRosterUrl(teamId, prevRosterId));
  }, [router, teamId, prevRosterId]);

  const goNext = useCallback(() => {
    if (isNil(teamId) || isNil(nextRosterId)) return;
    router.replace(buildRosterUrl(teamId, nextRosterId));
  }, [router, teamId, nextRosterId]);

  return (
    <div className="space-y-4">
      <FieldGroup>
        <FieldSet className="flex flex-row flex-wrap items-end gap-4">
          <FieldLayout className="w-(--input-width)">
            <Combobox
              placeHolder="選擇團隊"
              value={teamId}
              setValue={setTeamId}
              options={teams}
              getOptionValue={(team) => team.id}
              getOptionDisplay={(team) => team.name}
              icon={<Users />}
            />
          </FieldLayout>
          <div className="ml-auto flex flex-wrap gap-2">
            <CustomButton asChild>
              <CustomLink
                href={Path.ROSTER + Path.AUTO_NEW + "/" + (teamId ?? "")}
                isDisabled={isNil(teamId)}
              >
                <WandSparkles />
                自動編排
              </CustomLink>
            </CustomButton>
            <CustomButton asChild>
              <CustomLink href="" isDisabled={isNil(rosterId)}> {/* TODO */}
                <Pencil />
                更新值班表
              </CustomLink>
            </CustomButton>
          </div>
        </FieldSet>
      </FieldGroup>

      <div className="flex flex-wrap items-center gap-2">
        <CustomButton
          variant="outline"
          size="icon"
          disabled={isNil(prevRosterId)}
          onClick={goPrev}
          aria-label="上一個值班表"
        >
          <ChevronLeft />
        </CustomButton>
        <Combobox
          placeHolder="選擇值班表"
          value={rosterId}
          setValue={setRosterId}
          options={rosters}
          getOptionValue={(r) => r.id}
          getOptionDisplay={(r) => r.name}
          icon={<Calendar />}
        />
        <CustomButton
          variant="outline"
          size="icon"
          disabled={isNil(nextRosterId)}
          onClick={goNext}
          aria-label="下一個值班表"
        >
          <ChevronRight />
        </CustomButton>
      </div>

      {roster && (
        <Card>
          <CardContent>
            <RosterTable
              roster={roster}
              posts={posts}
              workers={workers}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
