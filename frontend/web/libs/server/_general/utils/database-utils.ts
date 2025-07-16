import { PrismaClientKnownRequestError } from "@/external/prisma-generated/runtime/library"
import { DataBaseQueryResponse } from "../models/database-query-response"

export const tryCatchQuery = async <T>(
  callback: () => Promise<T>,
): Promise<DataBaseQueryResponse<T>> => {
  try {
    const data = await callback()
    return { isSuccess: true, data }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return {
        isSuccess: false,
        error,
      }
    }

    throw error
  }
}

export const getPrismaErrorTarget = (error: PrismaClientKnownRequestError): string[] | undefined => 
  error.meta?.target as string[] | undefined;

export const getPrismaErrorModelName = (error: PrismaClientKnownRequestError): string | undefined =>
  error.meta?.modelName as string | undefined;