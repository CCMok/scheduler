import { ServerResponseStatus } from "@/libs/share/_general/enums/server-response-status"
import { ServerResponse } from "@/libs/share/_general/model/server-response"
import { Message, MessageTitle } from "../enums/message"

export type FeedbackMessage = {
  messageTitle: string,
  message: string,
}

export const getFeedbackMessage = (response: ServerResponse): FeedbackMessage | undefined => {
  if (response.status === ServerResponseStatus.OK) {
    return
  }

  if (response.status === ServerResponseStatus.BAD_REQUEST && response.message) {
    return {
      messageTitle: MessageTitle.INPUT_ERROR,
      message: response.message,
    }
  }
  
  return {
    messageTitle: MessageTitle.SYSTEM_ERROR,
    message: Message.SYSTEM_ERROR,
  }
}