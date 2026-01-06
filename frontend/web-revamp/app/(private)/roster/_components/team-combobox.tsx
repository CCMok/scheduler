'use client'

import Combobox from "@/components/_general/_custom/combobox/combobox";
import { Users } from "lucide-react";
import { useState } from "react";

export default function TeamCombobox() {
  const teams = [
    { id: 1, name: '團隊1' },
    { id: 2, name: '團隊2' },
    { id: 3, name: '團隊312312312313132123123' },
  ]

  const [selectedTeam, setSelectedTeam] = useState('')
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