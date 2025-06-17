'use client'

import { Button } from "@/external/shadcn/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/external/shadcn/components/ui/card"
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input"
import { Minus, Plus } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form"
import WorkerIdFormField from "./worker-id-form-field";
import DaysFormField from "./days-form-field";
import { useRosterStore } from "@/components/store/roster/roster-store-provider";

export default function OffFilter() {
  const { control, getValues } = useFormContext<RosterFilterFormInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'offs',
  })

  const { departments, setWorkers } = useRosterStore(state => state)

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
          className='w-full'
          onClick={onClickAppend}
        >
          <Plus />
        </Button>
      </CardContent>
    </Card>
  )
}