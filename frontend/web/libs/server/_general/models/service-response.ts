export enum ServiceResponseStatus {
  OK = 0,
  UNAUTHORIZED = 1,
  BAD_REQUEST = 2,
  INTERNAL_ERROR = 3,
}

export type OkResponse<T = unknown> = {
  status: ServiceResponseStatus.OK;
  data: T;
}

export type UnauthorizedResponse = {
  status: ServiceResponseStatus.UNAUTHORIZED;
}

export type FailResponse = {
  status: ServiceResponseStatus.BAD_REQUEST | ServiceResponseStatus.INTERNAL_ERROR;
  message?: string;
}

export type ServiceResponse<T = unknown> =
  OkResponse<T> | UnauthorizedResponse | FailResponse;