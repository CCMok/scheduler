'use client'

import CustomFormItem from "@/components/_general/form/custom-form-item"
import CustomSlider from "@/components/_general/slider/custom-slider"
import { FormField } from "@/external/shadcn/components/ui/form"
import { PostConstraintFormInput } from "@/libs/post-constraint/models/post-constraint-form-input"
import { MAX_WEIGHT, MIN_WEIGHT, STEP_WEIGHT } from "@/libs/_general/constants/weight-constant"
import { useFormContext } from "react-hook-form"

export default function WeightFormField() {
  const { control, setValue } = useFormContext<PostConstraintFormInput>()

  return (
    <FormField
      control={control}
      name="weighting"
      render={({ field }) => (
        <CustomFormItem>
          <CustomSlider
            label='權重'
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