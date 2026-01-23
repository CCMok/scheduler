'use client'

import FieldLayout from "@/components/_general/form/field/field-layout"
import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field"
import { use, useState } from "react"
import { Roster, Team } from "@/external/prisma/generated/client"
import Combobox from "@/components/_general/_custom/combobox/combobox"
import { Calendar, ChevronLeft, ChevronRight, Pencil, Users, WandSparkles } from "lucide-react"
import CustomButton from "@/components/_general/_custom/button/custom-button"
import CustomLink from "@/components/_general/_custom/link/custom-link"
import { Path } from "@/libs/_general/path/path"
import { isNil } from "lodash"

export default function RosterPageContent({
  teamsPromise,
  rostersPromise,
}: Readonly<{
  teamsPromise: Promise<Team[]>;
  rostersPromise: Promise<Roster[]>;
}>) {
  const teams = use(teamsPromise);
  const rosters = use(rostersPromise);
  const [selectedTeamId, setSelectedTeamId] = useState<number | undefined>(teams[0]?.id);
  const [selectedRosterId, setSelectedRosterId] = useState<number | undefined>(rosters[0]?.id);
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
          <div className='ml-auto space-x-2'>
            <CustomButton asChild>
              <CustomLink
                href={Path.ROSTER + Path.AUTO_NEW + '/' + selectedTeamId}
                isDisabled={isNil(selectedTeamId)}
              >
                <WandSparkles />
                自動編排
              </CustomLink>
            </CustomButton>
            <CustomButton asChild>
              <CustomLink
                href='' // TODO
                isDisabled={isNil(selectedRosterId)}
              >
                <Pencil />
                更新值班表
              </CustomLink>
            </CustomButton>
          </div>
        </FieldSet>
      </FieldGroup>
      <div className='space-x-4'>
        <CustomButton
          variant="outline"
          size="icon"
          disabled={!rosters.length || selectedRosterId === rosters.at(-1)?.id}
          onClick={(e) => {
            e.preventDefault();
            const currentIndex = rosters.findIndex(roster => roster.id === selectedRosterId)
            if (currentIndex === rosters.length - 1) return
            setSelectedRosterId(rosters[currentIndex + 1]?.id)
          }}
        >
          <ChevronLeft />
        </CustomButton>
        <Combobox
          placeHolder="選擇值班表"
          value={selectedRosterId}
          setValue={setSelectedRosterId}
          options={rosters}
          getOptionValue={(roster) => roster.id}
          getOptionDisplay={(roster) => roster.name}
          icon={<Calendar />}
        />
        <CustomButton
          variant="outline"
          size="icon"
          disabled={!rosters.length || selectedRosterId === rosters[0]?.id}
          onClick={(e) => {
            e.preventDefault();
            const currentIndex = rosters.findIndex(roster => roster.id === selectedRosterId)
            if (!currentIndex) return
            setSelectedRosterId(rosters[currentIndex - 1]?.id)
          }}
        >
          <ChevronRight />
        </CustomButton>
      </div>
      <div>
        <p>Roster table</p>
        <p>- Default show latest roster</p>
      </div>
    </div>
  )
}