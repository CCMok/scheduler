'use client'

import Combobox from "@/components/_general/_custom/combobox/combobox";
import FieldLayout from "@/components/_general/form/field/field-layout";
import { Team } from "@/external/prisma/generated/client";
import { Card, CardContent } from "@/external/shadcn/components/ui/card";
import { FieldGroup } from "@/external/shadcn/components/ui/field";
import { Plus, UsersRound } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { use } from "react";
import { searchParamKey } from "./param";
import { ROUTE } from "@/libs/_general/route/route-config";
import { Separator } from "@/external/shadcn/components/ui/separator";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import CustomLink from "@/components/_general/_custom/link/custom-link";

const TEAM_SELECT_ID = 'team-select';

export default function TeamSelector({
  teamsPromise,
}: Readonly<{
  teamsPromise: Promise<Team[]>;
}>) {
  const teams = use(teamsPromise);

  const searchParams = useSearchParams();
  const teamIdParam = searchParams.get(searchParamKey.TEAM_ID);
  const teamId = Number.parseInt(teamIdParam ?? '');

  const router = useRouter();

  const setTeamId = (id?: number) => {
    if (teamId === id) return;
    router.replace(ROUTE.private.setting.team.base({ [searchParamKey.TEAM_ID]: id }));
  }

  return (
    <Card>
      <CardContent className='space-y-3'>
        <FieldGroup className='flex-row flex-wrap'>
          <FieldLayout label="團隊" id={TEAM_SELECT_ID} className="w-(--input-width)">
            <Combobox
              id={TEAM_SELECT_ID}
              placeHolder="請選擇團隊"
              value={teamId ?? undefined}
              setValue={setTeamId}
              options={teams}
              getOptionValue={(team) => team.id}
              getOptionDisplay={(team) => team.name}
              icon={<UsersRound />}
              isOptional
            />
          </FieldLayout>
        </FieldGroup>
        <Separator />
        <div className="flex flex-wrap gap-3">
          <CustomButton asChild variant="outline">
            <CustomLink
              href={ROUTE.private.setting.team.new}
            >
              <Plus />
              新增
            </CustomLink>
          </CustomButton>
        </div>
      </CardContent>
    </Card>
  )
}