'use client';

import { useState, useCallback, useMemo } from 'react';
import { PostFilterFormInput } from '@/libs/client/post/models/post-filter-form-input';
import { getPostsAction } from '@/libs/server/post/actions/get-posts-action';
import { OrganizationDepartments } from '@/libs/server/organization/models/organization-model';
import PostFilterForm from './filter/post-filter-form';
import PostsTable from './table/posts-table';
import AddPostButton from './add-post-button';
import { Post } from '@/external/prisma-generated';
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';

type PostWithDepartment = Post & {
  department: {
    organization: {
      id: number;
      name: string;
    };
    id: number;
    name: string;
  };
};

type Props = {
  organizations: OrganizationDepartments[];
};

export default function PageSettingSection({
  organizations,
}: Readonly<Props>) {
  // Calculate default values based on first available options
  const defaultValues = useMemo(() => {
    const firstOrg = organizations.length > 0 ? organizations[0] : null;
    const firstDept = firstOrg?.departments.length ? firstOrg.departments[0] : null;

    return {
      organizationId: firstOrg ? firstOrg.id.toString() : '',
      departmentId: firstDept ? firstDept.id.toString() : '',
      name: '',
    };
  }, [organizations]);

  const [posts, setPosts] = useState<PostWithDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts based on filters
  const fetchPosts = useCallback(async (filterParams: PostFilterFormInput) => {
    setIsLoading(true);
    try {
      const request = {
        organizationId: filterParams.organizationId ? parseInt(filterParams.organizationId) : undefined,
        departmentId: filterParams.departmentId ? parseInt(filterParams.departmentId) : undefined,
        name: filterParams.name || undefined,
      };

      const response = await getPostsAction(request);

      if (response.status === ServerResponseStatus.OK && response.data) {
        setPosts(response.data as PostWithDepartment[]);
      } else {
        setPosts([]);
        console.error('Failed to fetch posts:', response);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="space-y-2">

      <div className="flex">
        <PostFilterForm
          organizations={organizations}
          defaultValues={defaultValues}
          onFilterChange={fetchPosts}
        />
        <div className='flex items-end ml-auto'>
          <AddPostButton />
        </div>
      </div>

      <PostsTable
        posts={posts}
        isLoading={isLoading}
      />
    </div>
  );
} 