import { Post } from "@/external/prisma/generated/browser";
import SelectWorkerPanel from "./select/select-worker-panel";
import UpdateWorkerPanel from "./update/update-worker-panel";
import { WorkerPost } from "@/libs/worker/worker";

export default function WorkerSettingDesktop({
  workers,
  posts,
  selectedWorkerId,
  setSelectedWorkerId,
}: Readonly<{
  workers: WorkerPost[];
  posts: Post[];
  selectedWorkerId?: number;
  setSelectedWorkerId: (workerId: number) => void;
}>) {
  const selectedWorker = workers.find(worker => worker.id === selectedWorkerId);
  return (
    <div className='flex space-x-2 h-full'>
      <SelectWorkerPanel
        className="w-80"
        workers={workers}
        selectedWorkerId={selectedWorkerId}
        setSelectedWorkerId={setSelectedWorkerId}
      />
      {selectedWorker && (
        <UpdateWorkerPanel
          key={selectedWorker.id} // re-mount when selectedWorkerId changes. To update form initial value.
          className="flex-1"
          worker={selectedWorker}
          posts={posts}
        />
      )}
    </div>
  )
}