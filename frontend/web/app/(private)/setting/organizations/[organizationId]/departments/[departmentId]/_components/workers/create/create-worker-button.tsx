'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { CreateWorkerFormInput, createWorkerFormInputSchema } from "@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/_components/workers/create/create-worker-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateWorkerFields from "./create-worker-fields";
import { ServiceResponse } from "@/libs/_general/models/service-response";
import { createWorkerAction } from "@/libs/worker/actions/create-worker-action";
import { useRouter } from 'next/navigation';

type Props = {
  departmentId: number;
}

export default function CreateWorkerButton({
  departmentId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createWorkerFormInputSchema),
    defaultValues: {
      name: '',
    },
  })

  const router = useRouter();

  const submit = async (input: CreateWorkerFormInput): Promise<ServiceResponse<number>> => {
    return await createWorkerAction({
      departmentId,
      workerName: input.name,
    })
  }

  const onSuccess = () => {
    router.refresh()
  }

  return (
    <CreateDialog
      entityName="人員"
      form={form}
      submit={submit}
      onSuccess={onSuccess}
    >
      <CreateWorkerFields />
    </CreateDialog>
  )
}