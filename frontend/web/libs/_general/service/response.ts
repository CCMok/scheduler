export type FailResponse = {
  isSuccess: false;
  message: string;
}

type SuccessResponseBase = {
  isSuccess: true;
}

// [T] extends [void] to preserve data attribute when T = <Entity | undefined>
type SuccessResponse<T = void> = [T] extends [void]
  ? SuccessResponseBase
  : SuccessResponseBase & {
    data: T;
  }

export type ServiceResponse<T = void> = FailResponse | SuccessResponse<T>

export type CreateResponseData = {
  id: number;
}