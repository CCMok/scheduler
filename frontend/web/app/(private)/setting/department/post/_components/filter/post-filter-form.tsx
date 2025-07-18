'use client';

import { useState, useEffect } from 'react';
import { PostFilterFormInput } from '@/libs/client/post/models/post-filter-form-input';
import { Card, CardHeader, CardTitle, CardContent } from '@/external/shadcn/components/ui/card';
import { OrganizationDepartments } from '@/libs/server/organization/models/organization-model';
import { useDebounce } from 'use-debounce';
import OrganizationIdFormField from './organization-id-form-field';
import DepartmentIdFormField from './department-id-form-field';
import PostNameFormField from './post-name-form-field';

type Props = {
  onFilterChange: (filters: PostFilterFormInput) => void;
  organizations: OrganizationDepartments[];
  defaultValues?: PostFilterFormInput;
};

export default function PostFilterForm({
  onFilterChange,
  organizations,
  defaultValues,
}: Readonly<Props>) {
  const [filters, setFilters] = useState<PostFilterFormInput>(
    defaultValues || {
      organizationId: '',
      departmentId: '',
      name: '',
    }
  );

  // Debounce the name filter to avoid too many API calls
  const [debouncedName] = useDebounce(filters.name || '', 500);

  // Create debounced filters object
  const debouncedFilters = {
    ...filters,
    name: debouncedName,
  };

  // Notify parent when debounced filters change
  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters.organizationId, debouncedFilters.departmentId, debouncedName, onFilterChange]);

  const handleOrganizationChange = (organizationId: string) => {
    // Find the selected organization and get its first department
    const selectedOrg = organizations.find(org => org.id.toString() === organizationId);
    const firstDepartmentId = selectedOrg?.departments.length 
      ? selectedOrg.departments[0].id.toString() 
      : '';

    setFilters(prev => ({
      ...prev,
      organizationId,
      departmentId: firstDepartmentId, // Set to first department instead of empty
    }));
  };

  const handleDepartmentChange = (departmentId: string) => {
    setFilters(prev => ({
      ...prev,
      departmentId,
    }));
  };

  const handleNameChange = (name: string) => {
    setFilters(prev => ({
      ...prev,
      name,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>篩選職位</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap space-x-4 space-y-4">
        <OrganizationIdFormField 
          value={filters.organizationId || ''}
          organizations={organizations}
          onValueChange={handleOrganizationChange}
        />
        <DepartmentIdFormField 
          value={filters.departmentId || ''}
          organizationId={filters.organizationId || ''}
          organizations={organizations}
          onValueChange={handleDepartmentChange} 
        />
        <PostNameFormField 
          value={filters.name || ''}
          onValueChange={handleNameChange}
        />
      </CardContent>
    </Card>
  );
} 