'use client'

import ComboBox from '@/components/_general/combobox/combo-box';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import { Organization } from "@/external/prisma-generated"
import { CreateUserOrganizationFormInput } from '@/app/(private)/setting/users/[userId]/_components/organizations/assign/create-user-organization-form-input';

type Props = {
  organizations: Organization[];
}

export default function OrganizationIdFormField({
  organizations,
}: Readonly<Props>) {
  const { control } = useFormContext<CreateUserOrganizationFormInput>();

  return (
    <FormField
      control={control}
      name='organizationId'
      render={({ field }) => (
        <CustomFormItem label='機構'>
          <ComboBox
            value={field.value}
            options={organizations}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => field.onChange(value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}