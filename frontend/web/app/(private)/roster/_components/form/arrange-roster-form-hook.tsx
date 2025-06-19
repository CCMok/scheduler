'use client'

import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { getArrangeRosterRequest } from "@/libs/server/roster/model/arrange/arrange-roster-request"
import { arrangeRosterAction } from "@/libs/server/roster/action/arrange-roster-action"
import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { getRootMessage } from "@/libs/client/_general/utils/form-utils"
import { useRosterStore } from "@/components/store/roster/roster-store-provider"
import { UseFormSetError } from "react-hook-form"
import { dayBaseToPostBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils"

type Props = {
  setError: UseFormSetError<ArrangeRosterFormInput>,
}

export default function useArrangeRosterForm({ 
  setError,
}: Readonly<Props>) {
  // Cannot useFormContext, this hook directly used by form component
  const { setPostBaseSchedules, setIsGenerated } = useRosterStore(state => state);
  
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

    const schedules = dayBaseToPostBaseSchedule(response.data)

    setPostBaseSchedules(schedules)
    setIsGenerated(true)
  }

  return { submit }
}