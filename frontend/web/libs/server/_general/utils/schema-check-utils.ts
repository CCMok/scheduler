import { z } from "zod";

export const customParse = <T extends z.ZodTypeAny>(schema: T, request: any): z.SafeParseReturnType<any, z.infer<T>> => {
  const result = schema.safeParse(request)
  if (!result.success) {
    console.warn('Invalid request', result.error.format())
  }

  return result;
}