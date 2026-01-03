type FailResponse = {
  isSuccess: false;
  message: string;
}

type SuccessResponseBase = {
  isSuccess: true;
}

type SuccessResponse<T = void> = T extends void
  ? SuccessResponseBase
  : SuccessResponseBase & {
    data: T;
  }

export type ServiceResponse<T = void> = FailResponse | SuccessResponse<T>