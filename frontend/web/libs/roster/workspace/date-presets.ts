import {
  eachDayOfInterval,
  endOfMonth,
  getDay,
  parse,
  startOfDay,
  startOfMonth,
} from "date-fns";
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

/** All dates in `month` whose `getDay()` equals `weekday` (0=Sun … 6=Sat). */
export function datesInMonthByWeekday(month: Date, weekday: number): Date[] {
  return eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  }).filter((d) => getDay(d) === weekday);
}

/**
 * Toggle every matching weekday inside `month` only.
 * All already selected → remove them; else add the missing ones.
 */
export function toggleWeekdayInMonth(
  selected: Date[],
  month: Date,
  weekday: number,
): Date[] {
  const targets = datesInMonthByWeekday(month, weekday);
  if (targets.length === 0) return selected;

  const selectedKeys = new Set(selected.map((d) => startOfDay(d).getTime()));
  const targetKeys = targets.map((d) => startOfDay(d).getTime());
  const allSelected = targetKeys.every((k) => selectedKeys.has(k));

  if (allSelected) {
    const remove = new Set(targetKeys);
    return selected.filter((d) => !remove.has(startOfDay(d).getTime()));
  }

  const next = [...selected];
  for (const target of targets) {
    const key = startOfDay(target).getTime();
    if (!selectedKeys.has(key)) next.push(target);
  }
  return next;
}
