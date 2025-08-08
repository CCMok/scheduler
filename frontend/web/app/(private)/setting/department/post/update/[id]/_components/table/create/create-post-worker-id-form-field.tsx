'use client'

import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Worker } from "@/external/prisma-generated"
import ComboBox from "@/components/combobox/combobox"
import { useFormContext } from "react-hook-form"
import { CreatePostWorkerFormInput } from "@/libs/client/post-worker/models/create-post-worker-form-input"
import { FormField } from "@/external/shadcn/components/ui/form"
import CustomFormItem from "@/components/form/custom-form-item"

type Props = {
  departmentId: number,
  existingWorkers: Worker[],
}

export default function CreatePostWorkerIdFormField({
  departmentId,
  existingWorkers,
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<CreatePostWorkerFormInput>();

  const isFirstRender = useRef(true)

  const router = useRouter()

  const [workers, setWorkers] = useState<Worker[]>([])

  const fetchWorkers = useCallback(async () => {
    const workers = await fetchData(
      async () => await getWorkersAction({
        where: { departmentId },
        orderBy: [{ field: 'name' }],
      }),
      path => router.push(path),
      [],
    )

    const filteredWorkers = workers.filter(worker => !existingWorkers.some(existingWorker => existingWorker.id === worker.id))

    setWorkers(filteredWorkers)
  }, [departmentId, router, existingWorkers])

  useEffect(() => {
    if (!isFirstRender.current) {
      return
    }

    fetchWorkers()

    isFirstRender.current = false
  }, [fetchWorkers])

  return (
    <FormField
      control={control}
      name='workerId'
      render={({ field }) => (
        <CustomFormItem label='人員'>
          <ComboBox
            value={field.value}
            options={workers}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue('workerId', value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}