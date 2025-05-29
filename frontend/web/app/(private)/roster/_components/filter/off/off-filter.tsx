'use client'

import ComboBox from "@/components/combobox/combobox";
import CustomFormItem from "@/components/form/custom-form-item";
import { useRosterFilterStore } from "@/components/store/roster-filter/roster-filter-store-provider";
import { Button } from "@/external/shadcn/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import { FormField } from "@/external/shadcn/components/ui/form";
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import { getWorkers } from "../roster-filter-form-utils";

export default function OffFilter() {
  const { control, setValue } = useFormContext<RosterFilterFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offs',
  })

  const { departments } = useRosterFilterStore(state => state)

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: departments.length ? departments[0].id.toString() : '',
  })

  const workers = useMemo(() => getWorkers(departments, departmentId), [departments, departmentId])

  useEffect(() => {
    const workerId = workers.length ? workers[0].id.toString() : ''
    fields.forEach((_, index) => {
      setValue(`offs.${index}.worker_id`, workerId)
    })
  }, [workers, setValue])

  const onClickAppend = () => append({
    worker_id: workers.length ? workers[0].id.toString() : '',
    days: [],
  })

  const onClickRemove = (index: number) => remove(index)

  return (
    <Card>
      <CardHeader>
        <CardTitle>請假</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {fields.map((item, index) => (
          <Card key={item.id} className='w-fit'>
            <CardContent className='flex gap-4 items-center'>
              <FormField
                control={control}
                name={`offs.${index}.worker_id`}
                render={({ field }) => (
                  <CustomFormItem label='人員'>
                    <ComboBox
                      value={field.value}
                      items={workers}
                      getValue={item => item.id.toString()}
                      getDisplayName={item => item.name}
                      onSelect={value => setValue(`offs.${index}.worker_id`, value)}
                    />
                  </CustomFormItem>
                )}
              />
              <Button
                type='button'
                variant='secondary'
                size='icon'
                onClick={() => onClickRemove(index)}
              >
                <Minus />
              </Button>
            </CardContent>
          </Card>
        ))}
        <Button
          type='button'
          variant='outline'
          size='icon'
          onClick={onClickAppend}
        >
          <Plus />
        </Button>
      </CardContent>
    </Card>
  )
}