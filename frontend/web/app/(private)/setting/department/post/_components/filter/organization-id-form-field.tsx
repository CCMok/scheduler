'use client';

import ComboBox from "@/components/combobox/combobox";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";

type Props = {
  value: string;
  organizations: OrganizationDepartments[];
  onValueChange: (value: string) => void;
};

export default function OrganizationIdFormField({
  value,
  organizations,
  onValueChange,
}: Readonly<Props>) {
  return (
    <ComboBox
      value={value}
      options={organizations}
      getValue={(option) => option.id.toString()}
      getDisplayName={(option) => option.name}
      onValueChange={onValueChange}
    />
  );
} 