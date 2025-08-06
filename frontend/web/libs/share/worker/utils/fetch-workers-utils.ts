import { Worker } from "@/external/prisma-generated"
import { GetWorkersRequest } from "@/libs/server/worker/models/get-workers-request"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"
import { toast } from "sonner"
import { SONNER_DEFAULT_OPTIONS } from "../../../client/_general/constants/sonnar-constant"
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"

export const fetchWorkers = async (departmentId: number, onRoute: (path: string) => void): Promise<Worker[]> => {
  const request: GetWorkersRequest = {
    departmentId,
  }

  const response = await getWorkersAction(request)

  const uiResponse = handleServiceResponse(response, onRoute)
  if (!uiResponse.isSuccess) {
    toast.error(uiResponse.message.title, {
      ...SONNER_DEFAULT_OPTIONS,
      description: uiResponse.message.content,
    })

    return []
  }

  return uiResponse.data
}