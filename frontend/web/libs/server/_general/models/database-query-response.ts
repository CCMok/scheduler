import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library"

export type DataBaseQueryResponse<T = {}> = SuccessResponse<T> | FailResponse

export type SuccessResponse<T = {}> = {
  isSuccess: true
  data: T
}

export type FailResponse = {
  isSuccess: false
  error: PrismaClientKnownRequestError,
} 