import { createStore } from 'zustand/vanilla'
import { Roster } from '@/libs/server/roster/model/roster'
import { Worker } from '@/external/prisma-generated'

export type RosterState = {
  response?: Roster,
  workers: Worker[],
}

export type RosterActions = {
  setResponse: (response?: Roster) => void,
  setWorkers: (workers: Worker[]) => void,
}

export type RosterStore = RosterState & RosterActions

export const defaultInitState: RosterState = {
  workers: [],
}

export const createRosterStore = (
  partialInitState?: Partial<RosterState>,
) => {
  return createStore<RosterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setResponse: response => set(() => ({ response })),
    setWorkers: workers => set(() => ({ workers })),
  }))
}