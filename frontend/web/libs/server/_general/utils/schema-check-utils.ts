import { z } from "zod";

export const schemaCheck = <T extends z.ZodTypeAny>(schema: T, request: any): boolean => {
  const result = schema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result.success;
}