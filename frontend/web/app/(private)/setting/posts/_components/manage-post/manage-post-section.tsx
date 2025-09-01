import { PostSettingStoreProvider } from '@/app/(private)/setting/posts/_components/manage-post/store/post-setting-store-provider';
import PostSettingFilterSection from './filter/post-setting-filter-section';
import PostTableSection from './table/post-table-section';
import CreatePostButton from './create-post/create-post-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card';
import UpdatePostSequenceButton from './update-post-sequence/update-post-sequence-button';

// TOOD: remove
export default function ManagePostSection() {
  return (
    <section>
      <PostSettingStoreProvider>
        <Card>
          <CardHeader>
            <CardTitle>職位管理</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <PostSettingFilterSection />
            <div className='space-y-2'>
              <div className='flex justify-end space-x-2'>
                <UpdatePostSequenceButton />
                <CreatePostButton />
              </div>
              <PostTableSection />
            </div>
          </CardContent>
        </Card>
      </PostSettingStoreProvider>
    </section>
  )
}