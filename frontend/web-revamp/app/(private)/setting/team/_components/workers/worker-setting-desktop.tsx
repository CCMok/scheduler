import { Post } from "@/external/prisma/generated/browser";
import SelectWorkerPanel from "./select/select-worker-panel";
import UpdateWorkerPanel from "./update/update-worker-panel";
import { WorkerPost } from "@/libs/worker/worker";
import { DetailPanelMode, DetailPanelState } from "./detail-panel-state";
import CreateWorkerPanel from "./create/create-worker-panel";

export default function WorkerSettingDesktop({
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
    <div className='flex space-x-2 h-full'>
      <SelectWorkerPanel
        className="w-80"
        workers={workers}
        detailPanelState={detailPanelState}
        setDetailPanelState={setDetailPanelState}
      />
      {selectedWorker && (
        <UpdateWorkerPanel
          key={selectedWorker.id} // re-mount when selectedWorkerId changes. To update form initial value.
          className="flex-1"
          worker={selectedWorker}
          posts={posts}
        />
      )}
      {detailPanelState.mode === DetailPanelMode.CREATE && (
        <CreateWorkerPanel
          className='flex-1'
          posts={posts}
          teamId={teamId}
        />
      )}
    </div>
  )
}