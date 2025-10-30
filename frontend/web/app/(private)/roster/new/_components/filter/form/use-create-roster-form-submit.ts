'use client'

import { arrangeRosterAction } from "@/libs/server/roster/actions/arrange-roster-action"
import { UseFormSetError } from "react-hook-form"
import { dayBaseToPostBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"
import { useRouter } from "next/navigation"
import { CreateRosterFilterFormInput } from "./create-roster-form-input"
import { useCreateRosterStore } from "../../store/create-roster-store-provider"
import { useCreateRosterFilterStore } from "../store/create-roster-filter-store-provider"

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

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    setGeneratedScheduleDepartmentId(Number(input.departmentId))
    setGeneratedScheduleWorkers(workers)
    setGeneratedScheduleOffs(input.offs)

    const schedules = dayBaseToPostBaseSchedule(uiResponse.data)
    setInitialSchedules(schedules)
    setModifiedSchedules(schedules)

    setIsGenerated(true)
  }

  return { submit }
}