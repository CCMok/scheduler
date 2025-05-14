import { ServerResponseStatus } from "@/libs/share/_general/enums/server-response-status"
import { ServerResponse } from "@/libs/share/_general/model/server-response"
import { ClientMessage, MessageTitle } from "../enums/client-message"

export type FeedbackMessage = {
  title: string,
  content: string,
}

export const getFeedbackMessage = (response: ServerResponse): FeedbackMessage | undefined => {
  if (response.status === ServerResponseStatus.OK) {
    return
  }

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