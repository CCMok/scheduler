'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { getArrangeRosterRequest } from "@/libs/server/roster/models/arrange/arrange-roster-request"
import { arrangeRosterAction } from "@/libs/server/roster/actions/arrange-roster-action"
import { useArrangeRosterStore } from "@/app/(private)/roster/_components/store/arrange-roster-store-provider"
import { UseFormSetError } from "react-hook-form"
import { dayBaseToPostBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils"
import { useArrangeRosterFilterStore } from "@/app/(private)/roster/_components/filter/store/arrange-roster-filter-store-provider"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"
import { useRouter } from "next/navigation"

type Props = {
  setError: UseFormSetError<ArrangeRosterFormInput>,
}

export default function useArrangeRosterFormSubmit({
  setError,
}: Readonly<Props>) {
  // Cannot useFormContext, this hook directly used by form component
  const setGeneratedScheduleDepartmentId = useArrangeRosterStore(state => state.setGeneratedScheduleDepartmentId);
  const setGeneratedScheduleWorkers = useArrangeRosterStore(state => state.setGeneratedScheduleWorkers);
  const setInitialSchedules = useArrangeRosterStore(state => state.setInitialSchedules);
  const setIsGenerated = useArrangeRosterStore(state => state.setIsGenerated);
  const setModifiedSchedules = useArrangeRosterStore(state => state.setModifiedSchedules);
  const workers = useArrangeRosterFilterStore(state => state.workers);

  const router = useRouter();

  const submit = async (input: ArrangeRosterFormInput) => {
    setIsGenerated(false)

    const request = getArrangeRosterRequest(input);

    const response = await arrangeRosterAction(request);

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    setGeneratedScheduleDepartmentId(Number(input.departmentId))
    setGeneratedScheduleWorkers(workers)

    const schedules = dayBaseToPostBaseSchedule(uiResponse.data)
    setInitialSchedules(schedules)
    setModifiedSchedules(schedules)

    setIsGenerated(true)
  }

  return { submit }
}