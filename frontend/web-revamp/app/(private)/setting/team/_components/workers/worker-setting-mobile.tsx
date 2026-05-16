import { Post } from "@/external/prisma/generated/browser";
import SelectWorkerPanel from "./select/select-worker-panel";
import WorkerDetailPanel from "./worker-detail-panel";
import { WorkerPost } from "@/libs/worker/worker";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/external/shadcn/components/ui/sheet";
import { DetailPanelMode, DetailPanelState } from "./detail-panel-state";
import { ReactNode } from "react";
import CreateWorkerPanel from "./create/create-worker-panel";
import { cn } from "@/external/shadcn/libs/utils";

const SheetBase = ({
  open,
  setDetailPanelState,
  children,
  className,
}: {
  open: boolean;
  setDetailPanelState: (state: DetailPanelState) => void;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <Sheet
      open={open}
      onOpenChange={(open) => !open && setDetailPanelState({ mode: DetailPanelMode.IDLE })}
    >
      <SheetContent side='bottom' className={cn('px-2 pb-2', className)}>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export default function WorkerSettingMobile({
  workers,
  posts,
  detailPanelState,
  setDetailPanelState,
  teamId,
}: Readonly<{
  workers: WorkerPost[];
  posts: Post[];
  detailPanelState: DetailPanelState;
  setDetailPanelState: (state: DetailPanelState) => void;
  teamId: number;
}>) {
  const selectedWorker = workers.find(worker =>
    detailPanelState.mode === DetailPanelMode.UPDATE && worker.id === detailPanelState.workerId
  );
  return (
    <div className='flex h-full'>
      <SelectWorkerPanel
        className='w-full'
        workers={workers}
        detailPanelState={detailPanelState}
        setDetailPanelState={setDetailPanelState}
      />
      <SheetBase
        open={selectedWorker !== undefined}
        setDetailPanelState={setDetailPanelState}
        className="h-(--sheet-max-height)"
      >
        <SheetHeader>
          <SheetTitle>
            更改職員資料
          </SheetTitle>
          <SheetDescription>
            在這裡您可以更改職員的名稱和負責的職務
          </SheetDescription>
        </SheetHeader>
        {selectedWorker && (
          <WorkerDetailPanel
            key={selectedWorker.id} // re-mount when selectedWorkerId changes. To update form initial value.
            className="flex-1 min-h-0"
            worker={selectedWorker}
            posts={posts}
            onDeleteSuccess={() => setDetailPanelState({ mode: DetailPanelMode.IDLE })}
          />
        )}
      </SheetBase>
      <SheetBase
        open={detailPanelState.mode === DetailPanelMode.CREATE}
        setDetailPanelState={setDetailPanelState}
      >
        <SheetHeader>
          <SheetTitle>
            新增職員
          </SheetTitle>
          <SheetDescription>
            在這裡您可以新增職員資料。
          </SheetDescription>
        </SheetHeader>
        <CreateWorkerPanel
          className="flex-1 min-h-0"
          posts={posts}
          teamId={teamId}
          onSuccess={() => setDetailPanelState({ mode: DetailPanelMode.IDLE })}
        />
      </SheetBase>
    </div>
  )
}