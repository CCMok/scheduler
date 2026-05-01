'use client'

import { useState } from "react";
import { Worker } from "@/external/prisma/generated/browser";
import SelectWorkerPanel from "./select-worker-panel";
import UpdateWorkerPanel from "./update/update-worker-panel";

export default function TeamWorkerSettingSection({
  workers,
}: Readonly<{
  workers: Worker[];
}>) {
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | undefined>();
  const selectedWorker = workers.find(worker => worker.id === selectedWorkerId);
  return (
    <div className='flex space-x-2 h-full'>
      {/* TODO: responsive */}
      <SelectWorkerPanel
        className="w-80"
        workers={workers}
        selectedWorkerId={selectedWorkerId}
        setSelectedWorkerId={setSelectedWorkerId}
      />
      {selectedWorker && (
        <UpdateWorkerPanel
          key={selectedWorker.id} // re-mount when selectedWorkerId changes. To update form initial value.
          className="flex-1 h-fit"
          worker={selectedWorker}
        />
      )}
    </div>
  );
}