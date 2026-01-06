'use client'

import Combobox from "@/components/_general/_custom/combobox/combobox";
import { Team } from "@/external/prisma/generated/client";
import { Users } from "lucide-react";
import { useState, use } from "react";

export default function TeamCombobox({
  teamsPromise,
}: Readonly<{
  teamsPromise: Promise<Team[]>
}>) {
  const teams = use(teamsPromise);

  const [selectedTeam, setSelectedTeam] = useState(teams[0]?.id.toString() ?? '')

  return (
    <Combobox
      placeHolder="選擇團隊"
      value={selectedTeam}
      setValue={setSelectedTeam}
      options={teams}
      getOptionValue={(team) => team.id.toString()}
      getOptionDisplay={(team) => team.name}
      icon={<Users />}
    />
  )
}