import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { ServerResponse } from "@/libs/share/_general/model/server-response"
import { ClientMessageContent, ClientMessageTitle } from "../enums/client-message-enum"
import { ClientMessage } from "../models/client-message-model"

// TODO: remove
export const getClientMessage = <T>(response: ServerResponse<T>): ClientMessage => {
  if (response.status === ServerResponseStatus.BAD_REQUEST && response.message) {
    return {
      title: ClientMessageTitle.INPUT_ERROR,
      content: response.message,
    }
  }

  return {
    title: ClientMessageTitle.SYSTEM_ERROR,
    content: ClientMessageContent.SYSTEM_ERROR,
  }
}