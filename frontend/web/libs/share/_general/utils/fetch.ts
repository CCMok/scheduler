import { ServiceResponse } from "../models/service-response";
import { handleServiceResponse } from "./service-response-handler";

export const fetchData = async <TResponse, TReturn>(
  action: () => Promise<ServiceResponse<TResponse>>,
  onRoute: (path: string) => void,
  fallbackValue: TReturn,
): Promise<TResponse | TReturn> => {
  const response = await action();

  const uiResponse = handleServiceResponse(response, onRoute);
  if (!uiResponse.isSuccess) {
    console.error(`Failed to fetch. message: ${JSON.stringify(uiResponse.message)}`);
    return fallbackValue;
  }

  return uiResponse.data;
};