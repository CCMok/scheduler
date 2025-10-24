'use client'

import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form";
import { CreateRosterFilterFormInput, CreateRosterFilterKey } from "../create-roster-form-input";
import { useCreateRosterFilterStore } from "../store/create-roster-filter-store-provider";
import CustomFormItem from "@/components/_general/form/custom-form-item";
import ComboBox from "@/components/_general/combobox/combo-box";

export default function DepartmentIdField() {
  const { control } = useFormContext<CreateRosterFilterFormInput>();

  const departments = useCreateRosterFilterStore(state => state.departments);

  return (
    <FormField
      control={control}
      name={CreateRosterFilterKey.DEPARTMENT_ID}
      render={({ field }) => (
        <CustomFormItem label='部門'>
          <ComboBox
            value={field.value}
            options={departments}
            getValue={option => option.id}
            getDisplayName={option => option.name}
            onValueChange={field.onChange}
            isFormField
            isOptional={false}
          />
        </CustomFormItem>
      )}
    />
  )

}