import { WorkerSettingStoreProvider } from '@/components/store/setting/worker/worker-setting-store-provider';
import WorkerSettingFilterSection from './_components/filter/worker-setting-filter-section';
import WorkerTableSection from './_components/table/worker-table-section';
import AddWorkerButton from './_components/add-worker/add-worker-button';

export default async function WorkerSettingPage() {
  return (
    <div className='space-y-4'>
      <WorkerSettingStoreProvider>
        <WorkerSettingFilterSection />
        <div className='space-y-2'>
          <div className='flex justify-end'>
            <AddWorkerButton />
          </div>
          <WorkerTableSection />
        </div>
      </WorkerSettingStoreProvider>
    </div>
  )
}