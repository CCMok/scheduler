import { RosterDisplay } from "@/libs/roster/roster";
import { Off } from "../../off";
import { createStore } from "zustand/vanilla";
import { isNil } from "lodash";

export type AutoNewRosterState = {
  step: number;
  timeslots: string[];
  offs: Off[];
  initialRoster: RosterDisplay;
  modifiedRoster: RosterDisplay;
}

export type AutoNewRosterAction = {
  nextStep: () => void;
  previousStep: () => void;
  setTimeslots: (timeslots: string[]) => void;
  setOffs: (offs: Off[]) => void;
  setInitialRoster: (initialRoster: RosterDisplay) => void;
  setModifiedRoster: (modifiedRoster: RosterDisplay) => void;
  updateAssignmentWorker: (assignmentId: number, workerId?: number) => void;
  swapAssignment: (assignmentId1: number, assignmentId2: number) => void;
}

export type AutoNewRosterStore = AutoNewRosterState & AutoNewRosterAction

export const initState: AutoNewRosterState = {
  step: 0,
  timeslots: [],
  offs: [],
  initialRoster: [],
  modifiedRoster: [],
}

const filterValidTimeslots = (offs: Off[], timeslots: string[]) => {
  return offs.map(off => ({
    ...off,
    timeslots: off.timeslots.filter((timeslot: string) => timeslots.includes(timeslot)),
  }))
}

const updateAssignmentWorker = (
  roster: RosterDisplay,
  assignmentId: number,
  workerId?: number,
): RosterDisplay => {
  return roster.map(rosterPost => ({
    ...rosterPost,
    timeslots: rosterPost.timeslots.map(timeslot => {
      if (timeslot.id === assignmentId) {
        return { ...timeslot, workerId }
      }
      return timeslot;
    })
  }))
}

const swapAssignment = (
  roster: RosterDisplay,
  assignmentId1: number,
  assignmentId2: number,
): RosterDisplay => {
  let workerId1: number | undefined;
  let workerId2: number | undefined;

  for (const rosterPost of roster) {
    for (const timeslot of rosterPost.timeslots) {
      if (timeslot.id === assignmentId1) {
        workerId1 = timeslot.workerId;
      }
      if (timeslot.id === assignmentId2) {
        workerId2 = timeslot.workerId;
      }
      if (!isNil(workerId1) && !isNil(workerId2)) {
        break;
      }
    }
  }

  return roster.map(rosterPost => ({
    ...rosterPost,
    timeslots: rosterPost.timeslots.map(timeslot => ({
      ...timeslot,
      workerId: (() => {
        if (timeslot.id === assignmentId1) {
          return workerId2;
        }
        if (timeslot.id === assignmentId2) {
          return workerId1;
        }
        return timeslot.workerId;
      })(),
    }))
  }))
}

export const createAutoNewRosterStore = () => {
  return createStore<AutoNewRosterStore>()((set) => ({
    ...initState,
    nextStep: () => set(({ step }) => ({ step: step + 1 })),
    previousStep: () => set(({ step }) => ({ step: step - 1 })),
    setTimeslots: (timeslots) => set(({ offs }) => ({
      offs: filterValidTimeslots(offs, timeslots),
      timeslots,
    })),
    setOffs: (offs) => set({ offs }),
    setInitialRoster: (initialRoster) => set({ initialRoster }),
    setModifiedRoster: (modifiedRoster) => set({ modifiedRoster }),
    updateAssignmentWorker: (assignmentId, worker) => set(({ modifiedRoster }) => ({
      modifiedRoster: updateAssignmentWorker(modifiedRoster, assignmentId, worker),
    })),
    swapAssignment: (assignmentId1, assignmentId2) => set(({ modifiedRoster }) => ({
      modifiedRoster: swapAssignment(modifiedRoster, assignmentId1, assignmentId2),
    })),
  }))
}