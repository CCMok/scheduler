'use client';

import CustomInput from "@/components/input/custom-input";
import { useWorkerSettingStore } from "@/app/(private)/setting/workers/_components/manage-worker/store/worker-setting-store-provider";
import { Label } from "@/external/shadcn/components/ui/label";

export default function WorkerNameField() {
  const workerNameFilter = useWorkerSettingStore(state => state.workerNameFilter);
  const setWorkerNameFilter = useWorkerSettingStore(state => state.setWorkerNameFilter);
  
  return (
    <div className='flex flex-col gap-2'>
      <Label htmlFor="workerName">人員名稱</Label>
      <CustomInput
        id="workerName"
        placeholder="搜尋..."
        value={workerNameFilter}
        onChange={e => setWorkerNameFilter(e.target.value)}
      />
    </div>
  );
}