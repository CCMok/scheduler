import { ServiceResponseStatus } from "../enums/service-response-status"

export type ServiceResponse<T = {}> = SuccessResponse<T> | FailResponse

export type SuccessResponse<T = {}> = {
  status: ServiceResponseStatus.OK,
  message?: string,
  data: T,
}

export type FailResponse = {
  status: Exclude<ServiceResponseStatus, ServiceResponseStatus.OK>,
  message?: string,
}