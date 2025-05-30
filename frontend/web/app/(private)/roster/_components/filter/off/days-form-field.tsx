'use client'

import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import CustomFormItem from "@/components/form/custom-form-item";
import { FormField } from "@/external/shadcn/components/ui/form";
import { useFormContext } from "react-hook-form"
import MultiSelectCommand from "@/components/command/multi-select-command";
import { useState } from "react";

type Props = {
  index: number;
}

// TODO real data
const frameworksList = [
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "ember", label: "Ember" },
];

export default function DaysFormField({
  index
}: Readonly<Props>) {
  const { control } = useFormContext<RosterFilterFormInput>();
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>(["react", "angular"]);

  return (
    <FormField
      control={control}
      name={`offs.${index}.days`}
      render={({ field }) => (
        <CustomFormItem label='缺席日'>
          <MultiSelectCommand
            options={frameworksList}
            onValueChange={setSelectedFrameworks}
            defaultValue={selectedFrameworks}
            placeholder="Select frameworks"
            variant="inverted"
            animation={2}
            maxCount={3}
          />
        </CustomFormItem>
      )}
    />
  )
}