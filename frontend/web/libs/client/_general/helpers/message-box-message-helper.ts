import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { ServerResponse } from "@/libs/share/_general/model/server-response"
import { ClientMessage, MessageTitle } from "../enums/client-message"
import { MessageBoxMessage } from "../models/message-box-message"

export const getMessageBoxMessage = (response: ServerResponse): MessageBoxMessage => {
  if (response.status === ServerResponseStatus.BAD_REQUEST && response.message) {
    return {
      title: MessageTitle.INPUT_ERROR,
      content: response.message,
    }
  }

  return {
    title: MessageTitle.SYSTEM_ERROR,
    content: ClientMessage.SYSTEM_ERROR,
  }
}