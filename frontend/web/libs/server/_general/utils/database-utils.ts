import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library"
import { DataBaseQueryResponse } from "../models/database-query-response"

export const tryCatchQuery = async <T>(
  callback: () => Promise<T>,
): Promise<DataBaseQueryResponse<T>> => {
  try {
    const data = await callback()
    return { isSuccess: true, data }
  } catch (error) {
    if (isPrismaClientKnownRequestError(error)) {
      const prismaError = error as PrismaClientKnownRequestError
      return {
        isSuccess: false,
        error: prismaError,
      }
    }

    throw error
  }
}

export const isPrismaClientKnownRequestError = (error: unknown): boolean => {
  if (process.env.NODE_ENV === 'production') {
    return error instanceof PrismaClientKnownRequestError
  }

  // In dev mode, constructor reference changes during hot reload. Cause PrismaClientKnownRequestError check fail.
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'name' in error &&
    error.name === 'PrismaClientKnownRequestError'
  )
}

export const getPrismaErrorTarget = (error: PrismaClientKnownRequestError): string[] | undefined =>
  error.meta?.target as string[] | undefined;

export const getPrismaErrorModelName = (error: PrismaClientKnownRequestError): string | undefined =>
  error.meta?.modelName as string | undefined;