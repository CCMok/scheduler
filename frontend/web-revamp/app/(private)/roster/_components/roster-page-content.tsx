'use client'

import FieldLayout from "@/components/_general/form/field/field-layout"
import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field"
import { use, useState } from "react"
import { Team } from "@/external/prisma/generated/client"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Users, WandSparkles } from "lucide-react"
import CustomButton from "@/components/_general/_custom/button/custom-button"
import CustomLink from "@/components/_general/_custom/link/custom-link"
import { Path } from "@/libs/_general/path/path"
import { isNil } from "lodash"

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
        <FieldSet className='flex flex-row items-end'>
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
          <CustomButton asChild>
            <CustomLink
              href={Path.ROSTER + Path.AUTO_NEW + '/' + selectedTeamId}
              isDisabled={isNil(selectedTeamId)}
            >
              <WandSparkles />
              自動排班
            </CustomLink>
          </CustomButton>
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