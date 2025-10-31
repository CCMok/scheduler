import { DynamicServerError } from "next/dist/client/components/hooks-server-context";
import { ServiceResponse, ServiceResponseStatus } from "../models/service-response";
import { ZodError } from "zod";

export const tryCatch = <T>(
  callback: (...args: any[]) => (ServiceResponse<T> | Promise<ServiceResponse<T>>),
): (...args: Parameters<typeof callback>) => ReturnType<typeof callback> =>
  async (...args: Parameters<typeof callback>) => {
    try {
      return await callback(...args)
    } catch (error) {
      return handleError(error)
    }
  }

const handleError = <T>(error: unknown): ServiceResponse<T> => {
  // Prevent dynamicServerError is uncatch by nextjs build engine
  // dynamicServerError is for nextjs to detemine route is dynamic or static generation. So it is expected error
  // e.g. call await cookies()
  if (error instanceof DynamicServerError) {
    throw error;
  }

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