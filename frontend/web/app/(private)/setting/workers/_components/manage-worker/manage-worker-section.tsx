import { Card, CardContent, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card';
import WorkerTableSection from './table/worker-table-section';
import WorkerSettingFilterSection from './filter/worker-setting-filter-section';
import CreateWorkerButton from './create-worker/create-worker-button';
import { WorkerSettingStoreProvider } from '@/app/(private)/setting/workers/_components/manage-worker/store/worker-setting-store-provider';

export default function ManageWorkerSection() {
  return (
    <section>
      <WorkerSettingStoreProvider>
        <Card>
          <CardHeader>
            <CardTitle>人員管理</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <WorkerSettingFilterSection />
            <div className='space-y-2'>
              <div className='flex justify-end'>
                <CreateWorkerButton />
              </div>
              <WorkerTableSection />
            </div>
          </CardContent>
        </Card>
      </WorkerSettingStoreProvider>
    </section>
  )
}