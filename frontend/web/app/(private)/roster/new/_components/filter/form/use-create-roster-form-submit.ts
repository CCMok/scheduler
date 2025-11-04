'use client'

import { createRosterAction } from "@/libs/roster/actions/create-roster-action"
import { dayBaseToPostBaseSchedule } from "@/libs/roster/utils/roster-transform-utils"
import { useRouter } from "next/navigation"
import { CreateRosterFilterFormInput } from "./create-roster-form-input"
import { useCreateRosterStore } from "../../store/create-roster-store-provider"
import { useCreateRosterFilterStore } from "../store/create-roster-filter-store-provider"
import { handleCudResponse } from "@/libs/_general/utils/response-utils"
import { isNil } from "lodash"

export default function useCreateRosterFormSubmit() {
  // Cannot useFormContext, this hook directly used by form component
  const setGeneratedScheduleDepartmentId = useCreateRosterStore(state => state.setGeneratedScheduleDepartmentId);
  const setGeneratedScheduleWorkers = useCreateRosterStore(state => state.setGeneratedScheduleWorkers);
  const setGeneratedScheduleOffs = useCreateRosterStore(state => state.setGeneratedScheduleOffs);
  const setInitialSchedules = useCreateRosterStore(state => state.setInitialSchedules);
  const setIsGenerated = useCreateRosterStore(state => state.setIsGenerated);
  const setModifiedSchedules = useCreateRosterStore(state => state.setModifiedSchedules);
  const workers = useCreateRosterFilterStore(state => state.workers);

  const router = useRouter();

  const submit = async (input: CreateRosterFilterFormInput) => {
    setIsGenerated(false)

    const response = await createRosterAction(input);
    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    setGeneratedScheduleDepartmentId(Number(input.departmentId))
    setGeneratedScheduleWorkers(workers)
    setGeneratedScheduleOffs(input.offs)

    const schedules = dayBaseToPostBaseSchedule(data)
    setInitialSchedules(schedules)
    setModifiedSchedules(schedules)

    setIsGenerated(true)
  }

  return { submit }
}