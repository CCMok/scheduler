'use client'

import ComboBox from "@/components/combobox/combobox";
import CustomFormItem from "@/components/form/custom-form-item";
import { Button } from "@/external/shadcn/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import { FormField } from "@/external/shadcn/components/ui/form";
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form"

export default function OffFilter() {
  const { control, setValue } = useFormContext<RosterFilterFormInput>();

  // TODO apply remove
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offs',
  })

  const onClickAdd = () => {
    append({
      worker_id: '',
      days: [],
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>請假</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-wrap gap-4'>
        {fields.map((item, index) => (
          <FormField
            key={item.id}
            control={control}
            name={`offs.${index}.worker_id`}
            render={({ field }) => (
              <CustomFormItem label='人員'>
                <ComboBox
                  value={field.value}
                  // TODO: real data
                  items={[{ id: 1, name: 'Worker 1' }, { id: 2, name: 'Worker 2' }]}
                  getValue={item => item.id.toString()}
                  getDisplayName={item => item.name}
                  onSelect={value => setValue(`offs.${index}.worker_id`, value)}
                />
              </CustomFormItem>
            )}
          />
        ))}
        <Button
          type='button'
          variant='outline'
          size='icon'
          onClick={onClickAdd}
        >
          <Plus />
        </Button>
      </CardContent>
    </Card>
  )
}