import { Schedule } from "@/libs/server/roster/model/roster";
import { Worker } from "@/external/prisma-generated";
import { UniqueIdentifier } from "@dnd-kit/core";

export const swapSchedule = (schedules: Schedule[], overArrangementId: UniqueIdentifier, activeArrangementId: UniqueIdentifier): Schedule[] => {
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