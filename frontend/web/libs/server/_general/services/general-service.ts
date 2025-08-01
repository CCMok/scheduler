import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ServerResponseStatus } from "../enums/server-response-status";
import { ZodError } from "zod";

export const serviceWrapper = async <T>(service: () => ServerResponse<T> | Promise<ServerResponse<T>>): Promise<ServerResponse<T>> => {
  try {
    return await service()
  } catch (error) {
    return handleError(error)
  }  
}

const handleError = <T>(error: unknown): ServerResponse<T> => {
  if (error instanceof ZodError) {
    console.warn('Invalid request', error.errors)
    return {
      status: ServerResponseStatus.BAD_REQUEST,
    }
  }

  console.error(error)
  return {
    status: ServerResponseStatus.INTERNAL_ERROR,
  }
}