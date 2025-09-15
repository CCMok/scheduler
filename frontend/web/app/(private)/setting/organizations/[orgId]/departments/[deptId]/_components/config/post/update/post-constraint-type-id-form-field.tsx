'use client'

import ComboBox from "@/components/_general/combobox/combo-box"
import CustomFormItem from "@/components/_general/form/custom-form-item"
import { PostConstraintType } from "@/external/prisma-generated"
import { FormField } from "@/external/shadcn/components/ui/form"
import { UpdatePostConstraintFormInput } from "@/libs/client/post-constraint/models/update-post-constraint-form-input"
import { useFormContext } from "react-hook-form"

type Props = {
  postConstraintTypes: PostConstraintType[];
}

export default function PostConstraintTypeIdFormField({
  postConstraintTypes,
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<UpdatePostConstraintFormInput>()

  return (
    <FormField
      control={control}
      name="postConstraintTypeId"
      render={({ field }) => (
        <CustomFormItem label='職位條件類型'>
          <ComboBox
            value={field.value}
            options={postConstraintTypes}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue('postConstraintTypeId', value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}