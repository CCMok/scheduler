import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import { z } from "zod";
import { idSchema } from "../../../_general/models/id";
import { MAX_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

export const offRequestSchema = z.object({
  workerId: idSchema,
  days: z.number().int().min(0).max(MAX_DAY_COUNT - 1).array(),
})

export type OffRequest = z.infer<typeof offRequestSchema>;

export const arrangeRosterRequestSchema = z.object({
  departmentId: idSchema,
  dayCount: z.number().int().positive().max(MAX_DAY_COUNT),
  offs: offRequestSchema.array(),
})

export type ArrangeRosterRequest = z.infer<typeof arrangeRosterRequestSchema>;

export const getArrangeRosterRequest = (formInput: RosterFilterFormInput): ArrangeRosterRequest => {
  return {
    departmentId: Number(formInput.departmentId),
    dayCount: formInput.dayCount,
    offs: formInput.offs.map(off => ({
      workerId: Number(off.workerId),
      days: off.days.map(day => Number(day)),
    })),
  };
}