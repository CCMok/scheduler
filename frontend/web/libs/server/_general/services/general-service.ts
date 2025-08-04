import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { ServiceResponseStatus } from "../../../share/_general/enums/service-response-status";
import { ZodError } from "zod";

export const serviceWrapper = async <T>(service: () => ServiceResponse<T> | Promise<ServiceResponse<T>>): Promise<ServiceResponse<T>> => {
  try {
    return await service()
  } catch (error) {
    return handleError(error)
  }  
}

const handleError = <T>(error: unknown): ServiceResponse<T> => {
  if (error instanceof ZodError) {
    console.warn('Invalid request', error.errors)
    return {
      status: ServiceResponseStatus.BAD_REQUEST,
    }
  }

  console.error(error)
  return {
    status: ServiceResponseStatus.INTERNAL_ERROR,
  }
}