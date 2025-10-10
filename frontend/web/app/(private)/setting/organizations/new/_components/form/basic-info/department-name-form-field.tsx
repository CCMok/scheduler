import CustomFormItem from '@/components/_general/form/custom-form-item';
import CustomInput from '@/components/_general/input/custom-input';
import { FormField, FormControl } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form";
import { CreateOrganizationFormInput } from '@/libs/client/organization/models/create-organization-form-input';

export default function DepartmentNameFormField() {
  const { control } = useFormContext<CreateOrganizationFormInput>()

  return (
    <FormField
      control={control}
      name="departmentName"
      render={({ field }) => (
        <CustomFormItem label='部門名稱'>
          <FormControl>
            <CustomInput
              {...field}
            />
          </FormControl>
        </CustomFormItem>
      )}
    />
  )
}