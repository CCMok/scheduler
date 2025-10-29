import { Worker } from "@/external/prisma-generated";
import { UniqueIdentifier } from "@dnd-kit/core";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";

export const swapSchedule = (schedules: PostBaseSchedule[], overArrangementId: UniqueIdentifier, activeArrangementId: UniqueIdentifier): PostBaseSchedule[] => {
  let overWorker: Worker | undefined;
  let activeWorker: Worker | undefined;

  // find over and active arrangement
  for (const schedule of schedules) {
    for (const arrangement of schedule.arrangements) {
      if (arrangement.id === overArrangementId) {
        overWorker = arrangement.worker;
      }

      if (arrangement.id === activeArrangementId) {
        activeWorker = arrangement.worker;
      }

      if (overWorker && activeWorker) {
        break;
      }
    }
  }

  // swap arrangement
  return schedules.map(schedule => ({
    ...schedule,
    arrangements: schedule.arrangements.map(arrangement => ({
      ...arrangement,
      worker: (() => {
        if (arrangement.id === overArrangementId) {
          return activeWorker;
        }

        if (arrangement.id === activeArrangementId) {
          return overWorker;
        }

        return arrangement.worker;
      })(),
    })),
  }))
}