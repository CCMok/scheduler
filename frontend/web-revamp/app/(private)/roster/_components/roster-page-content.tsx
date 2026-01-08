'use client'

import InputSkeleton from "@/components/_general/_custom/skeleton/input-skeleton"
import FieldLayout from "@/components/_general/form/field/field-layout"
import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field"
import { Suspense, use, useState } from "react"
import { Team } from "@/external/prisma/generated/client"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Users } from "lucide-react"

export default function RosterPageContent({
  teamsPromise,
}: Readonly<{
  teamsPromise: Promise<Team[]>;
}>) {
  const teams = use(teamsPromise);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(teams[0]?.id);
  return (
    <div className='space-y-4'>
      <FieldGroup>
        <FieldSet className='flex flex-row items-center'>
          <FieldLayout className='w-(--input-width)'>
              <Combobox
                placeHolder="選擇團隊"
                value={selectedTeamId}
                setValue={setSelectedTeamId}
                options={teams}
                getOptionValue={(team) => team.id}
                getOptionDisplay={(team) => team.name}
                icon={<Users />}
              />
          </FieldLayout>
          <span>Auto button to auto-schedule</span>
        </FieldSet>
      </FieldGroup>
      <div className='space-x-4'>
        <span>Previous button</span>
        <span>Roster Name (Click to Combobox search)</span>
        <span>Next button</span>
      </div>
      <div>
        <p>Roster table</p>
        <p>- Default show latest roster</p>
      </div>
    </div>
  )
}