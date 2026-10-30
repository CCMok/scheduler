'use client'

import { CalendarOff, Grid2x2 } from 'lucide-react'
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/external/shadcn/components/ui/tabs'
import type { WorkspaceMode } from '@/libs/roster/workspace/workspace-store'
import { useWorkspaceStore } from './workspace-store-provider'

export default function WorkspaceModeTabs() {
  const mode = useWorkspaceStore((s) => s.mode)
  const setMode = useWorkspaceStore((s) => s.setMode)

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-muted-foreground" id="workspace-mode-label">
        模式
      </span>
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as WorkspaceMode)}
        aria-labelledby="workspace-mode-label"
      >
        <TabsList>
          <TabsTrigger value="off" className="gap-1.5 px-3">
            <CalendarOff />
            休假
          </TabsTrigger>
          <TabsTrigger value="assign" className="gap-1.5 px-3">
            <Grid2x2 />
            編排
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}
