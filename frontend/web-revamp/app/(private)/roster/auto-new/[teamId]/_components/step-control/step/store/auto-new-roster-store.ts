import { RosterDisplay, RosterPostAssignmentWorker } from "@/libs/roster/roster";
import { Off } from "../../off";
import { createStore } from "zustand/vanilla";

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
  updateAssignmentWorker: (assignmentId: number, worker: RosterPostAssignmentWorker | undefined) => void;
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
  worker: RosterPostAssignmentWorker | undefined,
): RosterDisplay => {
  return roster.map((rosterPost) => ({
    ...rosterPost,
    assignments: rosterPost.assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return { ...assignment, worker }
      }
      return assignment;
    })
  }))
}

const swapAssignment = (
  rosterDisplay: RosterDisplay,
  assignmentId1: number,
  assignmentId2: number,
): RosterDisplay => {
  let worker1: RosterPostAssignmentWorker | undefined;
  let worker2: RosterPostAssignmentWorker | undefined;

  for (const rosterPost of rosterDisplay) {
    for (const assignment of rosterPost.assignments) {
      if (assignment.id === assignmentId1) {
        worker1 = assignment.worker;
      }
      if (assignment.id === assignmentId2) {
        worker2 = assignment.worker;
      }
      if (worker1 && worker2) {
        break;
      }
    }
  }

  return rosterDisplay.map(rosterPost => ({
    ...rosterPost,
    assignments: rosterPost.assignments.map(assignment => ({
      ...assignment,
      worker: (() => {
        if (assignment.id === assignmentId1) {
          return worker2;
        }
        if (assignment.id === assignmentId2) {
          return worker1;
        }
        return assignment.worker;
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