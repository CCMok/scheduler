'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { Minus, Plus } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form"
import WorkerIdFormField from "./worker-id-form-field";
import OffDaysFormField from "./off-days-form-field";
import CustomButton from "@/components/button/custom-button";
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";

export default function OffFilter() {
  const { control } = useFormContext<ArrangeRosterFormInput>();
  const workers = useArrangeRosterFilterStore(state => state.workers);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offs',
  })

  const onClickAppend = () => append({
    workerId: workers.length ? workers[0].id.toString() : '',
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
            <CardContent className='flex flex-col gap-4 sm:flex-row sm:items-center'>
              <WorkerIdFormField index={index} />
              <OffDaysFormField index={index} />
              <CustomButton
                variant='secondary'
                size='icon'
                onClick={() => onClickRemove(index)}
              >
                <Minus />
              </CustomButton>
            </CardContent>
          </Card>
        ))}
        <CustomButton
          variant='outline'
          className='w-full'
          onClick={onClickAppend}
        >
          <Plus />
        </CustomButton>
      </CardContent>
    </Card>
  )
}