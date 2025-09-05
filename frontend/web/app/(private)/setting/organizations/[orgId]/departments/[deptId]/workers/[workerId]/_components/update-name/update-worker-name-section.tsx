'use client'

import { Worker } from "@/external/prisma-generated"
import UpdateNameLayout from '@/components/_general/layout/update-name/update-name-layout'
import { UpdateNameFormInput } from "@/libs/client/setting/models/update-name-form-input"
import { ServiceResponse } from "@/libs/share/_general/models/service-response"
import { UpdateWorkerNameRequest } from "@/libs/server/worker/models/update-worker-name-request"
import { updateWorkerNameAction } from "@/libs/server/worker/actions/update-worker-name-action"

type Props = {
  worker: Worker;
}

export default function UpdateWorkerNameSection({
  worker,
}: Readonly<Props>) {
  const submit = async (input: UpdateNameFormInput): Promise<ServiceResponse> => {
    const request: UpdateWorkerNameRequest = {
      id: worker.id,
      name: input.name,
    }

    return await updateWorkerNameAction(request)
  }

  return (
    <UpdateNameLayout
      entityName="人員"
      originalName={worker.name}
      submit={submit}
    />
  )
}