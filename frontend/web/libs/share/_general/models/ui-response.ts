export type UiResponse<T = {}> = UiSuccessResponse<T> | UiFailResponse

export type UiSuccessResponse<T = {}> = {
  isSuccess: true,
  data: T,
}

export type UiFailResponse = {
  isSuccess: false,
  message: UiMessage,
}

export type UiMessage = {
  title: string,
  content: string,
}