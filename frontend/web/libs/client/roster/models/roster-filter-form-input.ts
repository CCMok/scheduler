import { z } from "zod";
import { ClientMessage } from "../../_general/enums/client-message";
import { MAX_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

export const offFormInputSchema = z.object({
  workerId: z.string().min(1, ClientMessage.REQUIRED),
  days: z.array(z.string())
    .superRefine((dayStrings, ctx) => {
      for (const dayStr of dayStrings) {
        const num = Number(dayStr);

        if (!Number.isInteger(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ClientMessage.INTEGER,
          });
          return;
        }

        if (num < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ClientMessage.MIN.replaceAll("{0}", "0"),
          });
          return;
        }

        if (num > (MAX_DAY_COUNT - 1)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ClientMessage.MAX.replaceAll("{0}", (MAX_DAY_COUNT - 1).toString()),
          });
          return;
        }
      }
    }),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>

export const arrangeRosterFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessage.REQUIRED),
  departmentId: z.string().min(1, ClientMessage.REQUIRED),
  dayCount: z.coerce.number()
    .int(ClientMessage.INTEGER)
    .positive(ClientMessage.MIN.replaceAll("{0}", "1"))
    .max(MAX_DAY_COUNT, ClientMessage.MAX.replaceAll("{0}", MAX_DAY_COUNT.toString())),
  offs: offFormInputSchema.array(),
})

export type ArrangeRosterFormInput = z.infer<typeof arrangeRosterFormInputSchema>