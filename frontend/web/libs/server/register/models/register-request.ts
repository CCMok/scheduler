import { z } from "zod";
import { emptyToUndefinedString } from "../../_general/models/optional-string";

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: emptyToUndefinedString,
})

export type RegisterRequest = z.infer<typeof registerRequestSchema>