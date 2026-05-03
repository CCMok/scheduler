import { Post } from "@/external/prisma/generated/browser";
import SelectWorkerPanel from "./select/select-worker-panel";
import UpdateWorkerPanel from "./update/update-worker-panel";
import { WorkerPost } from "@/libs/worker/worker";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/external/shadcn/components/ui/sheet";
import { isNil } from "lodash";

export default function WorkerSettingMobile({
  workers,
  posts,
  selectedWorkerId,
  setSelectedWorkerId,
}: Readonly<{
  workers: WorkerPost[];
  posts: Post[];
  selectedWorkerId?: number;
  setSelectedWorkerId: (workerId?: number) => void;
}>) {
  const selectedWorker = workers.find(worker => worker.id === selectedWorkerId);
  return (
    <div className='flex h-full'>
      <SelectWorkerPanel
        className='w-full'
        workers={workers}
        selectedWorkerId={selectedWorkerId}
        setSelectedWorkerId={setSelectedWorkerId}
      />
      <Sheet
        open={!isNil(selectedWorkerId)}
        onOpenChange={(open) => !open && setSelectedWorkerId()}
      >
        <SheetContent side='bottom' className='h-[90dvh] px-2'>
          <SheetHeader>
            <SheetTitle>
              更改職員資料
            </SheetTitle>
            <SheetDescription>
              在這裡您可以更改職員的名稱和負責的職務
            </SheetDescription>
          </SheetHeader>
          {selectedWorker && (
            <UpdateWorkerPanel
              key={selectedWorker.id} // re-mount when selectedWorkerId changes. To update form initial value.
              className="flex-1"
              worker={selectedWorker}
              posts={posts}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}