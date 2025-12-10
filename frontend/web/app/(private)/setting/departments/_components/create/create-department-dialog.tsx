'use client'

import CustomButton from "@/components/_general/button/custom-button";
import ComboBox from "@/components/_general/combobox/combo-box";
import CustomDialog from "@/components/_general/dialog/custom-dialog";
import CustomLink from "@/components/_general/link/custom-link";
import { Organization } from "@/external/prisma-generated";
import { Label } from "@/external/shadcn/components/ui/label";
import { PATH } from "@/libs/_general/enums/path";
import { isNil } from "lodash";
import { useState } from "react";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  organizations: Organization[];
}

export default function CreateDepartmentDialog({
  isOpen,
  setIsOpen,
  organizations,
}: Readonly<Props>) {
  const [organizationId, setOrganizationId] = useState<number | undefined>(undefined);

  return (
    <CustomDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title='新增部門'
      submitButton={
        <CustomButton>
          <CustomLink href={isNil(organizationId) ? '' : PATH.setting.organizations.departments.new(organizationId)}>
            確定
          </CustomLink>
        </CustomButton>
      }
    >
      <Label>機構</Label>
      <ComboBox
        value={organizationId?.toString() ?? ''}
        options={organizations}
        getValue={option => option.id.toString()}
        getDisplayName={option => option.name}
        onValueChange={value => setOrganizationId(Number(value))}
      />
    </CustomDialog>
  )
}