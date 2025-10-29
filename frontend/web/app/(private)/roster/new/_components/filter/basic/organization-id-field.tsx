'use client'

import ComboBox from "@/components/_general/combobox/combo-box"
import CustomFormItem from "@/components/_general/form/custom-form-item"
import { FormField } from "@/external/shadcn/components/ui/form"
import { useFormContext } from "react-hook-form";
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "../form/create-roster-form-input";
import { useCreateRosterFilterStore } from "../store/create-roster-filter-store-provider";

export default function OrganizationIdField() {
  const { control } = useFormContext<CreateRosterFilterFormInput>();

  const organizations = useCreateRosterFilterStore(state => state.organizations);

  return (
    <FormField
      control={control}
      name={CreateRosterFilterKey.ORGANIZATION_ID}
      render={({ field }) => (
        <CustomFormItem label='機構'>
          <ComboBox
            value={field.value}
            options={organizations}
            getValue={option => option.id}
            getDisplayName={option => option.name}
            onValueChange={value => {
              field.onChange(value);
              field.onBlur();
            }}
            isFormField
            isOptional={false}
          />
        </CustomFormItem>
      )}
    />
  )
}