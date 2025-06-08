import { createStore } from 'zustand/vanilla'
import { ArrangeRosterResponse } from '@/libs/server/roster/model/arrange-roster-response'

export type RosterState = {
  response: ArrangeRosterResponse | undefined,
}

export type RosterActions = {
  setResponse: (response: ArrangeRosterResponse |undefined) => void,
}

export type RosterStore = RosterState & RosterActions

export const defaultInitState: RosterState = {
  response: undefined,
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