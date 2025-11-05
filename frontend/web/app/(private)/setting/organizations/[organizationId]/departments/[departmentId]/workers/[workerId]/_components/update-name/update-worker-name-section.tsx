'use client'

import { Worker } from "@/external/prisma-generated"
import UpdateNameLayout from '@/components/_general/layout/update-name/update-name-layout'
import { UpdateNameFormInput } from "@/libs/_general/models/update-name-form-input"
import { ServiceResponse } from "@/libs/_general/models/service-response"
import { UpdateWorkerNameRequest } from "@/libs/worker/models/update-worker-name-request"
import { updateWorkerNameAction } from "@/libs/worker/actions/update-worker-name-action"
import { use } from "react"
import { notFound } from "next/navigation"

type Props = {
  workerPromise: Promise<Worker | undefined>;
}

export default function UpdateWorkerNameSection({
  workerPromise,
}: Readonly<Props>) {
  const worker = use(workerPromise);
  if (!worker) notFound();

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