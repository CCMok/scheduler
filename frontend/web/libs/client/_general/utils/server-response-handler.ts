import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response"
import { ClientMessage } from "../models/client-message";
import { ClientMessageContent, ClientMessageTitle } from "../enums/client-message-enum";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PATH } from "@/libs/share/_general/utils/path";

export const handleServerResponse = async <T>(
  response: ServerResponse<T>,
  onSuccess: (response: SuccessResponse<T>) => void | Promise<void>,
  onError: (response: ServerResponse<T>, clientMessage: ClientMessage) => void | Promise<void>,
  router?: AppRouterInstance
): Promise<void> => {
  switch (response.status) {
    case ServerResponseStatus.OK: {
      await onSuccess(response)
      break;
    }

    case ServerResponseStatus.UNAUTHORIZED: {
      if (router) {
        console.log('Unauthorized. Redirecting')
        router.push(PATH.login)
      } else {
        console.error('Unauthorized, but no router provided to redirect.')
      }
      break;
    }

    case ServerResponseStatus.BAD_REQUEST: {
      let clientMessage: ClientMessage;
      if (!response.message) {
        console.error("No Message for bad request")
        clientMessage = SYSTEM_ERROR_CLIENT_MESSAGE
      } else {
        clientMessage = {
          title: ClientMessageTitle.INPUT_ERROR,
          content: response.message,
        };
      }

      await onError(response, clientMessage);
      break;
    }

    default: {
      const clientMessage = SYSTEM_ERROR_CLIENT_MESSAGE;

      await onError(response, clientMessage);
      break;
    }
  }
}

export const SYSTEM_ERROR_CLIENT_MESSAGE: ClientMessage = {
  title: ClientMessageTitle.SYSTEM_ERROR,
  content: ClientMessageContent.SYSTEM_ERROR,
}