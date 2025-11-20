'use client'

import { useCreateRosterStore } from "@/app/(private)/roster/new/_components/store/create-roster-store-provider";
import dynamic from "next/dynamic";
import { useMemo } from "react";

// Fix dnd hydration mismatch
const RosterTable = dynamic(() => import('@/components/roster/table/roster-table'), { ssr: false })

export default function RosterTableClientContainer() {
  const modifiedSchedules = useCreateRosterStore(state => state.modifiedSchedules);
  const setModifiedSchedules = useCreateRosterStore(state => state.setModifiedSchedules);
  const generatedScheduleWorkers = useCreateRosterStore(state => state.generatedScheduleWorkers);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);

  const days = useMemo(() => {
    return modifiedSchedules.length ? modifiedSchedules[0].arrangements.map(arrangement => arrangement.day) : []
  }, [modifiedSchedules]) 

  return (
    <RosterTable
      days={days}
      schedules={modifiedSchedules}
      setSchedules={setModifiedSchedules}
      workers={generatedScheduleWorkers}
      offs={generatedScheduleOffs}
    />
  )
}