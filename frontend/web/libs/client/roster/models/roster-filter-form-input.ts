import { z } from "zod";
import { ClientMessage } from "../../_general/enums/client-message";
import { MAX_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

// TODO: To test days superRefine
// ctx.addIssue have problem
// return error : [{message}], but shadcn form message should be error.message
export const offFormInputSchema = z.object({
  workerId: z.string().min(1, ClientMessage.REQUIRED),
  days: z.string()
    .superRefine((val, ctx) => {
      if (!/^\d+$/.test(val)) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_string,
          validation: 'regex',
          message: "Day must be a string containing only digits (e.g., '0', '1', '23').",
        });
        return; // Stop further validation if the format is incorrect
      }

      const num = parseInt(val, 10);

      // The regex /^\d+$/ already ensures the string represents a non-negative integer.
      // So, we only need to check the upper bound against MAX_DAY_COUNT - 1.
      if (num > MAX_DAY_COUNT - 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: MAX_DAY_COUNT - 1,
          type: "number", // The comparison is numeric
          inclusive: true,
          message: `Day value '${val}' (interpreted as ${num}) must be less than or equal to ${MAX_DAY_COUNT - 1}.`,
        });
      }
    })
    .array(),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>

export const rosterFilterFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessage.REQUIRED),
  departmentId: z.string().min(1, ClientMessage.REQUIRED),
  dayCount: z.coerce.number()
    .int(ClientMessage.INTEGER)
    .positive(ClientMessage.MIN.replaceAll("{0}", "1"))
    .max(MAX_DAY_COUNT, ClientMessage.MAX.replaceAll("{0}", MAX_DAY_COUNT.toString())),
  offs: offFormInputSchema.array(),
})

export type RosterFilterFormInput = z.infer<typeof rosterFilterFormInputSchema>