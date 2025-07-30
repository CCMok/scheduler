'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { getArrangeRosterRequest } from "@/libs/server/roster/models/arrange/arrange-roster-request"
import { arrangeRosterAction } from "@/libs/server/roster/actions/arrange-roster-action"
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider"
import { UseFormSetError } from "react-hook-form"
import { dayBaseToPostBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils"
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider"
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook"
import { DayBaseSchedule } from "@/libs/share/roster/models/day-base-schedule"
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response"
import { ClientMessage } from "@/libs/client/_general/models/client-message"

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
  const { handleServerResponse } = useServerResponseHandler();
  
  const submit = async (input: ArrangeRosterFormInput) => {
    setIsGenerated(false)

    const request = getArrangeRosterRequest(input);

    const response = await arrangeRosterAction(request);

    await handleServerResponse(response, onSuccess(input), onError)
  }

  const onSuccess = (input: ArrangeRosterFormInput) => (response: SuccessResponse<DayBaseSchedule[]>) => {
    setGeneratedScheduleDepartmentId(Number(input.departmentId))
    setGeneratedScheduleWorkers(workers)

    const schedules = dayBaseToPostBaseSchedule(response.data)
    setInitialSchedules(schedules)
    setModifiedSchedules(schedules)

    setIsGenerated(true)
  }

  const onError = (_: ServerResponse<DayBaseSchedule[]>, clientMessage: ClientMessage) => {
    setError('root', { type: clientMessage.title, message: clientMessage.content })
  }

  return { submit }
}