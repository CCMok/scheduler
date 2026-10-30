'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { RosterJoin } from '@/libs/roster/roster'
import {
  createWorkspaceStore,
  type WorkspaceStore,
} from '@/libs/roster/workspace/workspace-store'

type WorkspaceStoreApi = ReturnType<typeof createWorkspaceStore>

const WorkspaceStoreContext = createContext<WorkspaceStoreApi | null>(null)

export function WorkspaceStoreProvider({
  teamId,
  roster,
  postIds,
  children,
}: Readonly<{
  teamId: number
  roster?: RosterJoin
  postIds: number[]
  children: ReactNode
}>) {
  const [store] = useState(() =>
    createWorkspaceStore({ teamId, roster, postIds }),
  )

  return (
    <WorkspaceStoreContext.Provider value={store}>
      {children}
    </WorkspaceStoreContext.Provider>
  )
}

export function useWorkspaceStore<T>(selector: (state: WorkspaceStore) => T): T {
  const store = useContext(WorkspaceStoreContext)
  if (!store) {
    throw new Error('useWorkspaceStore must be used within WorkspaceStoreProvider')
  }
  return useStore(store, selector)
}
