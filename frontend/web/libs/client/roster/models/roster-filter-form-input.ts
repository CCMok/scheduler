import { z } from "zod";
import { ClientMessageContent } from "../../_general/enums/client-message-enum";
import { MAX_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

export const offFormInputSchema = z.object({
  workerId: z.string().min(1, ClientMessageContent.REQUIRED),
  days: z.array(z.string())
    .superRefine((dayStrings, ctx) => {
      for (const dayStr of dayStrings) {
        const num = Number(dayStr);

        if (!Number.isInteger(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ClientMessageContent.INTEGER,
          });
          return;
        }

        if (num < 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ClientMessageContent.MIN.replaceAll("{0}", "0"),
          });
          return;
        }

        if (num > (MAX_DAY_COUNT - 1)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: ClientMessageContent.MAX.replaceAll("{0}", (MAX_DAY_COUNT - 1).toString()),
          });
          return;
        }
      }
    }),
})

export type OffFormInput = z.infer<typeof offFormInputSchema>

export const arrangeRosterFormInputSchema = z.object({
  organizationId: z.string().min(1, ClientMessageContent.REQUIRED),
  departmentId: z.string().min(1, ClientMessageContent.REQUIRED),
  dayCount: z.coerce.number()
    .int(ClientMessageContent.INTEGER)
    .positive(ClientMessageContent.MIN.replaceAll("{0}", "1"))
    .max(MAX_DAY_COUNT, ClientMessageContent.MAX.replaceAll("{0}", MAX_DAY_COUNT.toString())),
  offs: offFormInputSchema.array(),
})

export type ArrangeRosterFormInput = z.infer<typeof arrangeRosterFormInputSchema>