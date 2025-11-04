import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library"

export type DataBaseQueryResponse<T = {}> = DatabaseQuerySuccessResponse<T> | DatabaseQueryFailResponse

export type DatabaseQuerySuccessResponse<T = {}> = {
  isSuccess: true
  data: T
}

export type DatabaseQueryFailResponse = {
  isSuccess: false
  error: PrismaClientKnownRequestError,
} 