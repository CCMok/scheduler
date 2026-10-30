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
    <Tabs
      value={mode}
      onValueChange={(value) => setMode(value as WorkspaceMode)}
      aria-label="工作區模式"
    >
      <TabsList>
        <TabsTrigger value="off" className="gap-1 px-2.5">
          <CalendarOff className="size-3.5" />
          休假
        </TabsTrigger>
        <TabsTrigger value="assign" className="gap-1 px-2.5">
          <Grid2x2 className="size-3.5" />
          編排
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
