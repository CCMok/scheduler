'use client'

import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import CustomFormItem from "@/components/form/custom-form-item";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import MultiSelectCommand from "@/components/command/multi-select-command";
import { useState } from "react";
import { DEFAULT_DAY_COUNT } from "@/libs/share/roster/constants/roster-constant";

type Props = {
  index: number;
}

// TODO real data
const frameworksList = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
];

export default function DaysFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<RosterFilterFormInput>();
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["1", "2"]);

  return (
    <FormField
      control={control}
      name={`offs.${index}.days`}
      render={({ field }) => (
        <CustomFormItem label='缺席日'>
          <MultiSelectCommand
            options={frameworksList}
            onValueChange={setSelectedFrameworks}
            defaultValue={[]} // TODO from react hook form
            variant="inverted"
            animation={2}
            maxCount={DEFAULT_DAY_COUNT}
          />
        </CustomFormItem>
      )}
    />
  )
}