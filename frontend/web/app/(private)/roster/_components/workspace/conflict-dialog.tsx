'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/external/shadcn/components/ui/dialog'
import CustomButton from '@/components/_general/_custom/button/custom-button'
import { useWorkspaceStore } from './workspace-store-provider'
import { RosterJoin } from '@/libs/roster/roster'

export default function ConflictDialog({
  serverRoster,
}: Readonly<{
  serverRoster: RosterJoin
}>) {
  const conflictDraft = useWorkspaceStore((s) => s.conflictDraft)
  const resolveConflictKeepLocal = useWorkspaceStore((s) => s.resolveConflictKeepLocal)
  const resolveConflictUseServer = useWorkspaceStore((s) => s.resolveConflictUseServer)

  const open = conflictDraft != null

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>發現本機未存變更</DialogTitle>
          <DialogDescription>
            伺服器上的值班表已更新，與本機草稿不一致。請選擇保留本機未存內容，或改用伺服器版本。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <CustomButton
            variant="outline"
            onClick={() => resolveConflictUseServer(serverRoster)}
          >
            使用伺服器版本
          </CustomButton>
          <CustomButton onClick={() => resolveConflictKeepLocal()}>
            保留本機未存
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
