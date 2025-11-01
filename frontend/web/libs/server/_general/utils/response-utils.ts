import { REDIRECT_PUBLIC_PATH } from "@/libs/share/_general/utils/path";
import { ServiceResponse, ServiceResponseStatus } from "../models/service-response";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { MessageTitle } from "../enums/message";

export const handleGetResponse = <T>(
  response: ServiceResponse<T>,
  onRoute: (path: string) => void,
  defaultValue: T,
): T => {
  switch (response.status) {
    case ServiceResponseStatus.OK:
      return response.data;
    case ServiceResponseStatus.UNAUTHORIZED:
      onRoute(REDIRECT_PUBLIC_PATH);
      break;
    case ServiceResponseStatus.BAD_REQUEST:
    case ServiceResponseStatus.INTERNAL_ERROR:
      console.error(`Error response status: ${response.status}. Message: ${response.message}`);
      break;
    default:
      console.error(`Unknown response: ${JSON.stringify(response)}`);
      break;
  }

  return defaultValue;
}

/**
 * @returns Return data if success, otherwise undefined
 */
export const handleCudResponse = <T>(
  response: ServiceResponse<T>,
  onRoute: (path: string) => void,
): T | undefined => {
  switch (response.status) {
    case ServiceResponseStatus.OK:
      return response.data;
    case ServiceResponseStatus.UNAUTHORIZED:
      onRoute(REDIRECT_PUBLIC_PATH);
      break;
    case ServiceResponseStatus.BAD_REQUEST:
      toast.error(MessageTitle.INPUT_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: response.message,
      })
      break;
    case ServiceResponseStatus.INTERNAL_ERROR:
      console.error(`Error response status: ${response.status}. Message: ${response.message}`);
      toast.error(MessageTitle.INTERNAL_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: response.message,
      })
      break;
    default:
      console.error(`Unknown response: ${JSON.stringify(response)}`);
      break;
  }

  return undefined;
}