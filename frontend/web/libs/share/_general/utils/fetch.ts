import { ServiceResponse } from "../models/service-response";
import { handleServiceResponse } from "./service-response-handler";

export const fetchData = async <
  TData,
>(
  action: () => Promise<ServiceResponse<TData[]>>,
  onRoute: (path: string) => void,
) => {
  const response = await action();

  const uiResponse = handleServiceResponse(response, onRoute)
  if (!uiResponse.isSuccess) {
    console.error(`Failed to fetch workers. message: ${JSON.stringify(uiResponse.message)}`)
    return []
  }

  return uiResponse.data
}