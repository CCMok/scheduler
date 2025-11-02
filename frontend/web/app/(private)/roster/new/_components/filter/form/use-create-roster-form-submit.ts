'use client'

import { arrangeRosterAction } from "@/libs/server/roster/actions/arrange-roster-action"
import { UseFormSetError } from "react-hook-form"
import { dayBaseToPostBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils"
import { useRouter } from "next/navigation"
import { CreateRosterFilterFormInput } from "./create-roster-form-input"
import { useCreateRosterStore } from "../../store/create-roster-store-provider"
import { useCreateRosterFilterStore } from "../store/create-roster-filter-store-provider"
import { handleCudResponse } from "@/libs/server/_general/utils/response-utils"
import { isNil } from "lodash"

type Props = {
  setError: UseFormSetError<CreateRosterFilterFormInput>,
}

export default function useCreateRosterFormSubmit({
  setError,
}: Readonly<Props>) {
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

    const response = await arrangeRosterAction(input);
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