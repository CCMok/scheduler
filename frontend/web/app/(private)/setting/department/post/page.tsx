import { PostSettingStoreProvider } from '@/components/store/setting/post/post-setting-store-provider';
import PostSettingFilterSection from './_components/filter/post-setting-filter-section';
import PostTableSection from './_components/table/post-table-section';
import AddPostButton from './_components/add-post/add-post-button';
import { SearchParamProps } from '@/libs/share/_general/props/search-param-props';
import { Post } from '@/external/prisma-generated';
import { getPosts } from '@/libs/server/post/services/get-posts-service';
import { GetPostsRequest } from '@/libs/server/post/models/get-posts-request';
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import PostSettingStateUpdater from './_components/post-setting-state-updater';
import { SEARCH_PARAM_DEPARTMENT_ID } from './_components/post-setting-search-param';

const getPostsFromService = async (departmentId: string): Promise<Post[]> => {
  const departmentIdNumber = Number(departmentId);
  if (isNaN(departmentIdNumber)) return [];

  const request: GetPostsRequest = {
    departmentId: departmentIdNumber,
  }

  const response = await getPosts(request)
  // TODO: more generic response handler
  if (response.status !== ServerResponseStatus.OK) return [];

  return response.data;
}

type SearchParams = {
  [SEARCH_PARAM_DEPARTMENT_ID]?: string;
}

export default async function PostSettingPage({ searchParams }: Readonly<SearchParamProps<SearchParams>>) {
  const departmentId = (await searchParams).departmentId

  const posts = !departmentId ? [] : await getPostsFromService(departmentId)

  return (
    <div className='space-y-4'>
      <PostSettingStoreProvider>
        <PostSettingStateUpdater posts={posts} />
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