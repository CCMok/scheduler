import { emptyToUndefinedString } from "@/libs/_general/string/string-utils";
import { z } from "zod";

export const updateUserNameRequestSchema = z.object({
  name: emptyToUndefinedString,
})

export type UpdateUserNameRequest = z.infer<typeof updateUserNameRequestSchema>;
