import { Post } from "@/external/prisma-generated";
import { DayBaseSchedule } from "@/libs/share/roster/models/day-base-schedule";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";

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