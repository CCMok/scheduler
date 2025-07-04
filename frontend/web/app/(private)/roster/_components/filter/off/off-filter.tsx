'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import WorkerIdFormField from "./worker-id-form-field";
import DaysFormField from "./days-form-field";
import CustomButton from "@/components/button/custom-button";
import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";

export default function OffFilter() {
  const { control, getValues } = useFormContext<ArrangeRosterFormInput>();
  const departments = useArrangeRosterFilterStore(state => state.departments);
  const setWorkers = useArrangeRosterFilterStore(state => state.setWorkers);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offs',
  })

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: '',
  })

  const workers = useMemo(() => {
    const department = departments.find(department => department.id.toString() === departmentId)
    return department ? department.workers : [];
  }, [departments, departmentId])

  useEffect(() => {
    setWorkers(workers)

    const offs = getValues('offs')

    // Do not remove index items in forward iteration
    for (let i = offs.length - 1; i >= 0; i--) {
      const isWorkerInWorkers = workers.some(worker => worker.id.toString() === offs[i].workerId)
      if (!isWorkerInWorkers) {
        remove(i)
      }
    }
  }, [workers, setWorkers, getValues, remove])

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
              <DaysFormField index={index} />
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