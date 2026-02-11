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
import { Card, CardContent, } from "@/external/shadcn/components/ui/card";
import { buildRosterUrl } from "./param";
import H5 from "@/components/_general/_custom/typography/h5";
import { Separator } from "@/external/shadcn/components/ui/separator";

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
    <div className="space-y-3">
      <Card>
        <CardContent className='space-y-4'>
          <div className="space-y-4">
            <H5 className="text-muted-foreground">
              篩選條件
            </H5>
            <FieldGroup className='flex-row flex-wrap'>
              <FieldLayout label="團隊" id="team-select" className="w-(--input-width)">
                <Combobox
                  placeHolder="請選擇團隊"
                  value={teamId}
                  setValue={setTeamId}
                  options={teams}
                  getOptionValue={(team) => team.id}
                  getOptionDisplay={(team) => team.name}
                  icon={<Users />}
                />
              </FieldLayout>
              <FieldLayout label="值班表" id="roster-select" className="w-(--input-width)">
                <div className="flex items-center gap-2">
                  <CustomButton
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
          </div>
          <Separator />
          <div className="space-y-4">
            <H5 className="text-muted-foreground">
              操作
            </H5>
            <div className="flex flex-wrap gap-3">
              <CustomButton asChild variant="default">
                <CustomLink
                  href={Path.ROSTER + Path.AUTO_NEW + "/" + (teamId ?? "")}
                  isDisabled={isNil(teamId)}
                >
                  <WandSparkles />
                  自動編排
                </CustomLink>
              </CustomButton>
              {/* TODO */}
              {/* <CustomButton asChild variant="outline">
                <CustomLink href="" isDisabled={isNil(rosterId)}>
                  <Pencil />
                  更新
                </CustomLink>
              </CustomButton> */}
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          {roster ? (
            <RosterTable
              roster={roster}
              posts={posts}
              workers={workers}
            />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-3">
              <Calendar className="h-12 w-12 text-muted-foreground" />
              <div className='text-center'>
                <p className="text-lg font-medium text-muted-foreground">
                  未選擇值班表
                </p>
                <p className="text-sm text-muted-foreground/70">
                  請先選擇團隊和值班表以查看詳細資訊
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
