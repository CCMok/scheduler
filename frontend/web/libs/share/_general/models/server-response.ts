import { ServerResponseStatus } from "../../../server/_general/enums/server-response-status"

export type ServerResponse<T = {}> = SuccessResponse<T> | FailResponse

export type SuccessResponse<T = {}> = {
  status: ServerResponseStatus,
  message?: string,
  data: T,
}

export type FailResponse = {
  status: Exclude<ServerResponseStatus, ServerResponseStatus.OK>,
  message?: string,
}