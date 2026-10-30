'use client'

import type { ReactNode } from 'react'
import { Post, Worker } from '@/external/prisma/generated/client'
import { RosterJoin } from '@/libs/roster/roster'
import { useWorkspaceStore } from './workspace-store-provider'
import WorkspaceToolbar from './workspace-toolbar'
import DateBar from './date-bar'
import OffMatrix from './off-matrix'
import AssignGrid from './assign-grid'
import ConflictDialog from './conflict-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card'
import { Separator } from '@/external/shadcn/components/ui/separator'

export default function WorkspaceMain({
  posts,
  workers,
  serverRoster,
  title,
  variant,
  guidance,
}: Readonly<{
  posts: Post[]
  workers: Worker[]
  serverRoster?: RosterJoin
  title: string
  variant: 'create' | 'edit'
  guidance?: ReactNode
}>) {
  const mode = useWorkspaceStore((s) => s.mode)

  return (
    <>
      {serverRoster ? <ConflictDialog serverRoster={serverRoster} /> : null}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {guidance}
          <WorkspaceToolbar posts={posts} workers={workers} variant={variant} />
          <Separator />
          <DateBar />
          <Separator />
          {mode === 'off' ? (
            <OffMatrix workers={workers} />
          ) : (
            <AssignGrid posts={posts} workers={workers} />
          )}
        </CardContent>
      </Card>
    </>
  )
}
