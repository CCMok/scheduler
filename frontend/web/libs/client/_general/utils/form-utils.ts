import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status"
import { ServerResponse } from "@/libs/share/_general/model/server-response"
import { ClientMessage, MessageTitle } from "../enums/client-message"
import { FormRootMessage } from "../models/form-root-message"

export const getRootMessage = (response: ServerResponse): FormRootMessage => {
  if (response.status === ServerResponseStatus.BAD_REQUEST && response.message) {
    return {
      title: MessageTitle.INPUT_ERROR,
      content: response.message,
    }
  }

  // TODO: handle unauthorized

  return {
    title: MessageTitle.SYSTEM_ERROR,
    content: ClientMessage.SYSTEM_ERROR,
  }
}