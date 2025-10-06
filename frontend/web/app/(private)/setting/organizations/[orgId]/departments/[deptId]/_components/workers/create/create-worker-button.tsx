'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { CreateWorkerFormInput, createWorkerFormInputSchema } from "@/libs/client/worker/models/create-worker-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateWorkerFields from "./create-worker-fields";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { createWorkerAction } from "@/libs/server/worker/actions/create-worker-action";
import { Param } from '@/libs/share/_general/enums/param';
import { useParams, useRouter } from 'next/navigation';
import { Id } from '@/libs/server/_general/models/id';

export default function CreateWorkerButton() {
  const form = useForm({
    resolver: zodResolver(createWorkerFormInputSchema),
    defaultValues: {
      name: '',
    },
  })
  
  const router = useRouter();

  const params = useParams();
  const orgId = Number(params[Param.ORG_ID]);
  const deptId = Number(params[Param.DEPT_ID]);

  if (isNaN(orgId) || isNaN(deptId)) {
    console.error(`orgId or deptId is not found. orgId: ${orgId} deptId: ${deptId}`)
    return <></>
  }

  const submit = async (input: CreateWorkerFormInput): Promise<ServiceResponse<Id>> => {
    return await createWorkerAction({
      departmentId: Number(deptId),
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