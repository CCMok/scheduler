'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import { PostFilterFormInput } from '@/libs/client/post/models/post-filter-form-input';
import { getPostsAction } from '@/libs/server/post/actions/get-posts-action';
import { OrganizationDepartments } from '@/libs/server/organization/models/organization-dao';
import PostFilterForm from './filter/post-filter-form';
import PostsTable from './table/posts-table';
import AddPostButton from './add-post-button';
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { PostOrganization } from '@/libs/server/post/models/post-dao';

type Props = {
  organizations: OrganizationDepartments[];
};

export default function PageSettingSection({
  organizations,
}: Readonly<Props>) {
  const defaultFilter = useMemo(() => {
    const firstOrg = organizations.length ? organizations[0] : null;
    const firstDept = firstOrg?.departments.length ? firstOrg.departments[0] : null;

    return {
      organizationId: firstOrg ? firstOrg.id.toString() : '',
      departmentId: firstDept ? firstDept.id.toString() : '',
      name: '',
    };
  }, [organizations]);

  const [allPosts, setAllPosts] = useState<PostOrganization[]>([]);
  const [filters, setFilters] = useState<PostFilterFormInput>(defaultFilter);
  const [isLoading, setIsLoading] = useState(false);

  // Client-side filtering by name
  const filteredPosts = useMemo(() => {
    if (!filters.name) {
      return allPosts;
    }

    return allPosts.filter(post =>
      post.name.toLowerCase().includes(filters.name!.toLowerCase())
    );
  }, [allPosts, filters.name]);

  // Fetch posts only when departmentId changes
  const fetchPostsForDepartment = useCallback(async (departmentId: string) => {
    if (!departmentId) {
      setAllPosts([]);
      return;
    }

    setIsLoading(true);
    try {
      const request = {
        departmentId: parseInt(departmentId),
      };

      const response = await getPostsAction(request);

      if (response.status === ServerResponseStatus.OK && response.data) {
        setAllPosts(response.data);
      } else {
        setAllPosts([]);
        console.error('Failed to fetch posts:', response);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setAllPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch posts when departmentId changes
  useEffect(() => {
    fetchPostsForDepartment(filters.departmentId || '');
  }, [filters.departmentId, fetchPostsForDepartment]);

  const handleFilterChange = (newFilters: PostFilterFormInput) => {
    setFilters(newFilters);
    // Note: Only departmentId changes will trigger server fetch via useEffect
    // Name changes are handled by client-side filtering
  };

  return (
    <div className="space-y-6">
      <PostFilterForm
        organizations={organizations}
        defaultValues={defaultFilter}
        onFilterChange={handleFilterChange}
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">職位管理</h2>
        <AddPostButton />
      </div>

      <PostsTable
        posts={filteredPosts}
        isLoading={isLoading}
      />
    </div>
  );
} 