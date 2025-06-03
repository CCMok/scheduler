import { RosterFilterFormInput } from "./roster-filter-form-input";

export type ArrangeRosterRequestBody = {
  departmentId: number;
  dayCount: number;
  offs: OffRequest[]
}

export type OffRequest = {
  workerId: number;
  days: number[];
}

export const getArrangeRosterRequestBody = (formInput: RosterFilterFormInput): ArrangeRosterRequestBody => {
  return {
    departmentId: Number(formInput.departmentId),
    dayCount: formInput.dayCount,
    offs: formInput.offs.map(off => ({
      workerId: Number(off.workerId),
      days: off.days.map(day => Number(day)),
    })),
  };
}