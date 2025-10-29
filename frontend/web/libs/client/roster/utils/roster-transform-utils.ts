import { Post } from "@/external/prisma-generated";
import { RosterHistoryScheduleRelated } from "@/libs/server/roster/models/roster-history-dao";
import { DayBaseSchedule } from "@/libs/share/roster/models/day-base-schedule";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { compareAsc } from "date-fns";

export const dayBaseToPostBaseSchedule = (dayBaseSchedules: DayBaseSchedule[]): PostBaseSchedule[] => {
  const postBaseSchedules: PostBaseSchedule[] = [];

  for (const dayBaseSchedule of dayBaseSchedules) {
    for (const dayBaseArrangement of dayBaseSchedule.arrangements) {
      const postBaseSchedule = findOrCreatePostBaseSchedule(postBaseSchedules, dayBaseArrangement.post);

      const postBaseArrangement = {
        id: dayBaseArrangement.id,
        day: dayBaseSchedule.day,
        worker: dayBaseArrangement.worker,
      }

      postBaseSchedule.arrangements.push(postBaseArrangement);
    }
  }

  return postBaseSchedules;
}

const findOrCreatePostBaseSchedule = (
  schedules: PostBaseSchedule[],
  post: Post,
): PostBaseSchedule => {
  let schedule = schedules.find(schedule => schedule.post.id === post.id);
  if (schedule) return schedule;

  schedule = { post, arrangements: [] };
  schedules.push(schedule);
  return schedule;
};

export const postBaseToDayBaseSchedule = (postBaseSchedules: PostBaseSchedule[]): DayBaseSchedule[] => {
  const dayBaseSchedules: DayBaseSchedule[] = [];

  for (const postBaseSchedule of postBaseSchedules) {
    for (const postBaseArrangement of postBaseSchedule.arrangements) {
      const dayBaseschedule = findOrCreateDayBaseSchedule(dayBaseSchedules, postBaseArrangement.day);

      const dayBaseArrangement = {
        id: postBaseArrangement.id,
        post: postBaseSchedule.post,
        worker: postBaseArrangement.worker,
      }

      dayBaseschedule.arrangements.push(dayBaseArrangement);
    }
  }

  return dayBaseSchedules;
}

const findOrCreateDayBaseSchedule = (
  schedules: DayBaseSchedule[],
  day: Date,
): DayBaseSchedule => {
  let schedule = schedules.find(schedule => compareAsc(schedule.day, day) === 0);
  if (schedule) return schedule;

  schedule = { day, arrangements: [] };
  schedules.push(schedule);
  return schedule;
};

export const rosterHistorySchedulesToDayBaseSchedule = (rosterHistorySchedules: RosterHistoryScheduleRelated[]): DayBaseSchedule[] =>
  rosterHistorySchedules.map(rosterHistorySchedule => ({
    day: rosterHistorySchedule.day,
    arrangements: rosterHistorySchedule.rosterHistoryScheduleArrangements.map(rosterHistoryScheduleArrangement => ({
      id: rosterHistoryScheduleArrangement.id,
      post: rosterHistoryScheduleArrangement.post,
      worker: rosterHistoryScheduleArrangement.worker ?? undefined,
    })),
  }))