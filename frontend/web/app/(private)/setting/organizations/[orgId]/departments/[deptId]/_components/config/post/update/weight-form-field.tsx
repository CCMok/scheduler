'use client'

import CustomFormItem from "@/components/_general/form/custom-form-item"
import { FormField } from "@/external/shadcn/components/ui/form"
import { Slider } from "@/external/shadcn/components/ui/slider"
import { UpdatePostConstraintFormInput } from "@/libs/client/post-constraint/models/update-post-constraint-form-input"
import { MAX_WEIGHT, MIN_WEIGHT, STEP_WEIGHT } from "@/libs/share/_general/constants/weight-constant"
import { useFormContext } from "react-hook-form"

export default function WeightFormField() {
  const { control, setValue } = useFormContext<UpdatePostConstraintFormInput>()

  return (
    <FormField
      control={control}
      name="weighting"
      render={({ field }) => (
        <CustomFormItem label='權重'>
          {/* TODO: display value */}
          <Slider
            value={[field.value]}
            onValueChange={value => setValue('weighting', value[0])}
            max={MAX_WEIGHT}
            min={MIN_WEIGHT}
            step={STEP_WEIGHT}
          />
        </CustomFormItem>
      )}
    />
  )
}