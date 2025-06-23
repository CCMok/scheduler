'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { getArrangeRosterRequest } from "@/libs/server/roster/model/arrange/arrange-roster-request"
import { arrangeRosterAction } from "@/libs/server/roster/action/arrange-roster-action"
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider"
import { UseFormGetValues, UseFormSetError } from "react-hook-form"
import { dayBaseToPostBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils"
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider"
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook"
import { DayBaseSchedule } from "@/libs/share/roster/models/day-base-schedule"
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/model/server-response"
import { ClientMessage } from "@/libs/client/_general/models/client-message-model"

type Props = {
  setError: UseFormSetError<ArrangeRosterFormInput>,
  getValues: UseFormGetValues<ArrangeRosterFormInput>,
}

export default function useArrangeRosterForm({ 
  setError,
  getValues,
}: Readonly<Props>) {
  // Cannot useFormContext, this hook directly used by form component
  const { setDepartmentId, setWorkers, setPostBaseSchedules, setIsGenerated } = useArrangeRosterStore(state => state);
  const { workers } = useArrangeRosterFilterStore(state => state);
  const { handleServerResponse } = useServerResponseHandler();
  
  const submit = async (input: ArrangeRosterFormInput) => {
    setIsGenerated(false)

    const request = getArrangeRosterRequest(input);

    const response = await arrangeRosterAction(request);

    await handleServerResponse(response, onSuccess, onError)
  }

  const onSuccess = (response: SuccessResponse<DayBaseSchedule[]>) => {
    const departmentId = getValues('departmentId')
    setDepartmentId(Number(departmentId))

    setWorkers(workers)

    const schedules = dayBaseToPostBaseSchedule(response.data)
    setPostBaseSchedules(schedules)

    setIsGenerated(true)
  }

  const onError = (_: ServerResponse<DayBaseSchedule[]>, clientMessage: ClientMessage) => {
    setError('root', { type: clientMessage.title, message: clientMessage.content })
  }

  return { submit }
}