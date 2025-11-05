'use client'

import CustomButton from "@/components/_general/button/custom-button";
import ComboBox from "@/components/_general/combobox/combo-box";
import CustomDialog from "@/components/_general/dialog/custom-dialog";
import CustomLink from "@/components/_general/link/custom-link";
import { Organization } from "@/external/prisma-generated";
import { AlertDialogTrigger } from "@/external/shadcn/components/ui/alert-dialog";
import { Label } from "@/external/shadcn/components/ui/label";
import { PATH } from "@/libs/_general/enums/path";
import { isNil } from "lodash";
import { Plus } from "lucide-react";
import { use, useState } from "react";

type Props = {
  organizationsPromise: Promise<Organization[]>;
}

export default function CreateDepartmentButton({
  organizationsPromise,
}: Readonly<Props>) {
  const organizations = use(organizationsPromise);

  const [organizationId, setOrganizationId] = useState<number | undefined>(undefined);

  return (
    <CustomDialog
      title='新增部門'
      trigger={(
        <AlertDialogTrigger asChild>
          <CustomButton>
            <Plus />
            新增
          </CustomButton>
        </AlertDialogTrigger>
      )}
      submitButton={
        <CustomButton>
          <CustomLink href={isNil(organizationId) ? '' : PATH.setting.organizations.departments.new(organizationId)}>
            繼續
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