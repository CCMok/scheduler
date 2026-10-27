import { parse } from "date-fns";
import { zhHK } from "date-fns/locale";
import { formatDate } from "@/libs/_general/date/date-utils";
import { Timeslot } from "@/libs/roster/roster";

export function datesToTimeslots(dates: Date[], startId = 1): Timeslot[] {
  return dates
    .toSorted((a, b) => a.getTime() - b.getTime())
    .map((date, i) => ({
      id: startId + i,
      name: formatDate(date),
    }));
}

export function timeslotsToDates(timeslots: Timeslot[]): Date[] {
  return timeslots
    .map((t) => {
      const parsed = parse(t.name, "PP", new Date(), { locale: zhHK });
      if (!Number.isNaN(parsed.getTime())) return parsed;
      return new Date(t.name);
    })
    .filter((d) => !Number.isNaN(d.getTime()));
}
