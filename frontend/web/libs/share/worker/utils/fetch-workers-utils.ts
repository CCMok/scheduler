import { Worker } from "@/external/prisma-generated"
import { GetWorkersRequest } from "@/libs/server/worker/models/get-workers-request"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"

export const fetchWorkers = async (departmentId: number, onRoute: (path: string) => void): Promise<Worker[]> => {
  const request: GetWorkersRequest = {
    departmentId,
  }

  const response = await getWorkersAction(request)

  const uiResponse = handleServiceResponse(response, onRoute)
  if (!uiResponse.isSuccess) {
    console.error(`Failed to fetch workers. message title: ${uiResponse.message.title}, content: ${uiResponse.message.content}`)
    return []
  }

  return uiResponse.data
}