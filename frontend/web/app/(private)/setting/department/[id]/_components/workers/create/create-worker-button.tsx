'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { CreateWorkerFormInput, createWorkerFormInputSchema } from "@/libs/client/worker/models/create-worker-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateWorkerFields from "./create-worker-fields";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { createWorkerAction } from "@/libs/server/worker/actions/create-worker-action";

type Props = {
  deptId: number;
}

export default function CreateWorkerButton({
  deptId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createWorkerFormInputSchema),
    defaultValues: {
      name: '',
    },
  })

  const submit = async (input: CreateWorkerFormInput): Promise<ServiceResponse> => {
    return await createWorkerAction({
      departmentId: Number(deptId),
      workerName: input.name,
    })
  }

  return (
    <CreateDialog
      entityName="人員"
      form={form}
      submit={submit}
    >
      <CreateWorkerFields />
    </CreateDialog>
  )
}