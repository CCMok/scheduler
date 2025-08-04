import { ServiceResponseStatus } from "@/libs/share/_general/enums/service-response-status";
import { ServiceResponse } from "@/libs/share/_general/models/service-response"
import { UiMessage, UiResponse } from "../models/ui-response";
import { UiMessageContent, UiMessageTitle } from "../enums/ui-message";
import { PATH } from "@/libs/share/_general/utils/path";

export const handleServiceResponse = <T>(
  response: ServiceResponse<T>,
  onRoute: (path: string) => void,
): UiResponse<T> => {
  switch (response.status) {
    case ServiceResponseStatus.OK: {
      return {
        isSuccess: true,
        data: response.data,
      }
    }

    case ServiceResponseStatus.UNAUTHORIZED: {
      console.log('Unauthorized. Redirecting')
      onRoute(PATH.login)
      return {
        isSuccess: false,
        message: {
          title: UiMessageTitle.CAUTION,
          content: UiMessageContent.UNAUTHORIZED,
        },
      }
    }

    case ServiceResponseStatus.BAD_REQUEST: {
      let uiMessage: UiMessage;
      if (!response.message) {
        console.error("No Message for bad request")
        uiMessage = SYSTEM_ERROR_UI_MESSAGE
      } else {
        uiMessage = {
          title: UiMessageTitle.INPUT_ERROR,
          content: response.message,
        };
      }

      return {
        isSuccess: false,
        message: uiMessage,
      }
    }

    default: {
      return {
        isSuccess: false,
        message: SYSTEM_ERROR_UI_MESSAGE,
      }
    }
  }
}

export const SYSTEM_ERROR_UI_MESSAGE: UiMessage = {
  title: UiMessageTitle.SYSTEM_ERROR,
  content: UiMessageContent.SYSTEM_ERROR,
}