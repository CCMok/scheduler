'use client'

import Combobox from "@/components/_general/_custom/combobox/combobox";
import FieldLayout from "@/components/_general/form/field/field-layout";
import { Team } from "@/external/prisma/generated/client";
import { Plus, UsersRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { isNil } from "lodash";
import { searchParamKey } from "./param";
import { ROUTE } from "@/libs/_general/route/route-config";
import ToolbarButton from "@/components/_general/_custom/button/toolbar-button";
import CustomLink from "@/components/_general/_custom/link/custom-link";

const TEAM_SELECT_ID = 'team-select';

export default function TeamSelector({
  teams,
  teamId,
}: Readonly<{
  teams: Team[];
  teamId?: number;
}>) {
  const router = useRouter();

  const setTeamId = (id?: number) => {
    if (isNil(id) || teamId === id) return;
    router.replace(ROUTE.private.setting.team.base({ [searchParamKey.TEAM_ID]: id }));
  }

  return (
    <section className="workspace-nav">
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
        <div className="toolbar-row-end">
          <ToolbarButton asChild>
            <CustomLink href={ROUTE.private.setting.team.new}>
              <Plus />
              新增
            </CustomLink>
          </ToolbarButton>
        </div>
      </div>
    </section>
  )
}
