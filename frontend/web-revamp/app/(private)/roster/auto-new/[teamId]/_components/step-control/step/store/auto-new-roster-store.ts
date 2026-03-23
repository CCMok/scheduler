import { OffPerWorker, RosterItem, Timeslot } from "@/libs/roster/roster";
import { createStore } from "zustand/vanilla";

export type AutoNewRosterState = {
  step: number;
  timeslots: Timeslot[];
  offs: OffPerWorker[];
  initialRoster: RosterItem[];
  modifiedRoster: RosterItem[];
}

export type AutoNewRosterAction = {
  nextStep: () => void;
  previousStep: () => void;
  setTimeslots: (timeslots: Timeslot[]) => void;
  setOffs: (offs: OffPerWorker[]) => void;
  setInitialRoster: (initialRoster: RosterItem[]) => void;
  setModifiedRoster: (modifiedRoster: RosterItem[]) => void;
}

export type AutoNewRosterStore = AutoNewRosterState & AutoNewRosterAction

export const initState: AutoNewRosterState = {
  step: 0,
  timeslots: [],
  offs: [],
  initialRoster: [],
  modifiedRoster: [],
}

const filterValidTimeslots = (offs: OffPerWorker[], timeslots: Timeslot[]) => {
  return offs.map(off => ({
    ...off,
    timeslots: off.timeslotIds.filter((timeslotId) => timeslots.some(t => t.id === timeslotId)),
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
  }))
}