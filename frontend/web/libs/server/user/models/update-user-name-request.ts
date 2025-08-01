import { z } from "zod";
import { emptyToUndefinedString } from "../../_general/models/optional-string";

export const updateUserNameRequestSchema = z.object({
  name: emptyToUndefinedString,
})

export type UpdateUserNameRequest = z.infer<typeof updateUserNameRequestSchema>