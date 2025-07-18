'use client';

import ComboBox from "@/components/combobox/combobox";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-model";
import { useMemo } from "react";

type Props = {
  value: string;
  organizationId: string;
  organizations: OrganizationDepartments[];
  onValueChange: (value: string) => void;
};

export default function DepartmentIdFormField({
  value,
  organizationId,
  organizations,
  onValueChange,
}: Readonly<Props>) {
  const departments = useMemo(() => {
    if (!organizationId) {
      // If no organization selected, show all departments from all organizations
      return organizations.flatMap(org => org.departments.map(dept => ({
        ...dept,
        displayName: `${org.name} - ${dept.name}`,
      })));
    }
    
    const selectedOrg = organizations.find(org => org.id.toString() === organizationId);
    return selectedOrg ? selectedOrg.departments.map(dept => ({
      ...dept,
      displayName: dept.name,
    })) : [];
  }, [organizations, organizationId]);

  return (
    <ComboBox
      value={value}
      options={departments}
      getValue={(option) => option.id.toString()}
      getDisplayName={(option) => option.displayName}
      onValueChange={onValueChange}
    />
  );
} 