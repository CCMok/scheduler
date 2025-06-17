import { Schedule } from "@/libs/server/roster/model/roster";
import { cloneDeep } from "lodash";
import { Worker } from "@/external/prisma-generated";
import { UniqueIdentifier } from "@dnd-kit/core";

export const swapSchedule = (schedules: Schedule[], overArrangementId: UniqueIdentifier, activeArrangementId: UniqueIdentifier) => {
  let overWorker: Worker | undefined;
  let activeWorker: Worker | undefined;

  const scheduleCopy = cloneDeep(schedules);

  // find over and active arrangement
  for (const schedule of scheduleCopy) {
    const overArrangement = schedule.arrangements.find(arrangement => arrangement.id === overArrangementId);
    if (overArrangement) {
      overWorker = overArrangement.worker
    }

    const activeArrangement = schedule.arrangements.find(arrangement => arrangement.id === activeArrangementId);
    if (activeArrangement) {
      activeWorker = activeArrangement.worker
    }
  }

  // swap arrangement
  for (const schedule of scheduleCopy) {
    const overArrangement = schedule.arrangements.find(arrangement => arrangement.id === overArrangementId);
    if (overArrangement) {
      overArrangement.worker = activeWorker;
    }

    const activeArrangement = schedule.arrangements.find(arrangement => arrangement.id === activeArrangementId);
    if (activeArrangement) {
      activeArrangement.worker = overWorker;
    }
  }

  return scheduleCopy;
}