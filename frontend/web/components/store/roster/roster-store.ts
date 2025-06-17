import { createStore } from 'zustand/vanilla'
import { Roster } from '@/libs/server/roster/model/roster'

export type RosterState = {
  response?: Roster,
}

export type RosterActions = {
  setResponse: (response?: Roster) => void,
}

export type RosterStore = RosterState & RosterActions

export const defaultInitState: RosterState = {
}

export const createRosterStore = (
  partialInitState?: Partial<RosterState>,
) => {
  return createStore<RosterStore>()(set => ({
    ...defaultInitState,
    ...partialInitState,
    setResponse: response => set(() => ({ response })),
  }))
}