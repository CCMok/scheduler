'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { getArrangeRosterRequest } from "@/libs/server/roster/model/arrange/arrange-roster-request"
import { arrangeRosterAction } from "@/libs/server/roster/action/arrange-roster-action"
import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { getRootMessage } from "@/libs/client/_general/utils/form-utils"
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider"
import { UseFormGetValues, UseFormSetError } from "react-hook-form"
import { dayBaseToPostBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils"
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider"

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
  
  const submit = async (input: ArrangeRosterFormInput) => {
    setIsGenerated(false)

    const request = getArrangeRosterRequest(input);

    const response = await arrangeRosterAction(request);
    if (response.status !== ServerResponseStatus.OK) {
      const rootMessage = getRootMessage(response)
      setError('root', { type: rootMessage.title, message: rootMessage.content })
      return
    }

    // TODO: handle unauthorized

    const departmentId = getValues('departmentId')
    setDepartmentId(Number(departmentId))

    setWorkers(workers)

    const schedules = dayBaseToPostBaseSchedule(response.data)
    setPostBaseSchedules(schedules)

    setIsGenerated(true)
  }

  return { submit }
}