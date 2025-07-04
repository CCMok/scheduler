import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response"
import { ClientMessage } from "../models/client-message-model";
import { ClientMessageContent, ClientMessageTitle } from "../enums/client-message-enum";
import { Path } from "@/libs/share/_general/enums/path";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
        router.push(Path.LOGIN)
      } else {
        console.error('Unauthorized, but no router provided to redirect.')
      }
      break;
    }

    case ServerResponseStatus.BAD_REQUEST: {
      let clientMessage: ClientMessage;
      if (!response.message) {
        console.error("No Message for bad request")
        clientMessage = {
          title: ClientMessageTitle.SYSTEM_ERROR,
          content: ClientMessageContent.SYSTEM_ERROR,
        }
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
      const clientMessage: ClientMessage = {
        title: ClientMessageTitle.SYSTEM_ERROR,
        content: ClientMessageContent.SYSTEM_ERROR,
      };

      await onError(response, clientMessage);
      break;
    }
  }
} 