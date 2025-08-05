import { PostSettingStoreProvider } from '@/components/store/setting/post/post-setting-store-provider';
import PostSettingFilterSection from './_components/filter/post-setting-filter-section';
import PostTableSection from './_components/table/post-table-section';
import AddPostButton from './_components/add-post/add-post-button';

export default async function PostSettingPage() {
  return (
    <div className='space-y-4'>
      <PostSettingStoreProvider>
        <PostSettingFilterSection />
        <div className='space-y-2'>
          <div className='flex justify-end'>
            <AddPostButton />
          </div>
          <PostTableSection />
        </div>
      </PostSettingStoreProvider>
    </div>
  )
}