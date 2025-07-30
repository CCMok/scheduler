import { PostSettingStoreProvider } from '@/components/store/setting/post/post-setting-store-provider';
import PostSettingFilterSection from './_components/filter/post-setting-filter-section';
import PostTableSection from './_components/table/post-table-section';

export default function PostSettingPage() {
  return (
    <div className='space-y-4'>
      <PostSettingStoreProvider>
        <PostSettingFilterSection />
        <PostTableSection />
      </PostSettingStoreProvider>
    </div>
  )
}