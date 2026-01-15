import { RosterDto } from "@/libs/roster/roster";
import { Off } from "../../off";
import { createStore } from "zustand/vanilla";

export type AutoNewRosterState = {
  step: number;
  timeslots: string[];
  offs: Off[];
  roster: RosterDto;
}

export type AutoNewRosterAction = {
  nextStep: () => void;
  previousStep: () => void;
  setTimeslots: (timeslots: string[]) => void;
  setOffs: (offs: Off[]) => void;
  setRoster: (roster: RosterDto) => void;
}

export type AutoNewRosterStore = AutoNewRosterState & AutoNewRosterAction

export const initState: AutoNewRosterState = {
  step: 0,
  timeslots: [],
  offs: [],
  roster: [],
}

const filterValidTimeslots = (offs: Off[], timeslots: string[]) => {
  return offs.map(off => ({
    ...off,
    timeslots: off.timeslots.filter((timeslot: string) => timeslots.includes(timeslot)),
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
    setRoster: (roster) => set({ roster }),
  }))
}