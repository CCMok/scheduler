'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ServiceResponse } from "@/libs/_general/models/service-response";
import { useRouter } from "next/navigation";
import { CreateUpdateWorkerConstraintFormInput, createUpdateWorkerConstraintFormInputSchema } from '@/libs/worker-constraint/models/worker-constraint-form-input';
import CreateUpdateWorkerConstraintFields from '../form/create-update-worker-constraint-fields';
import { WorkerConstraintType, Worker } from '@/external/prisma-generated';
import { createWorkerConstraintAction } from '@/libs/worker-constraint/actions/create-worker-constraint-action';

type Props = {
  workerConstraintTypes: WorkerConstraintType[];
  workers: Worker[];
  departmentId: number;
}

export default function CreateWorkerConstraintButton({
  workerConstraintTypes,
  workers,
  departmentId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createUpdateWorkerConstraintFormInputSchema),
    defaultValues: {
      workerConstraintTypeId: '',
      weighting: 1,
      workers: [],
    },
  })

  const router = useRouter();

  const submit = async (input: CreateUpdateWorkerConstraintFormInput): Promise<ServiceResponse<number>> => {
    return await createWorkerConstraintAction({
      departmentId,
      workerConstraintTypeId: Number(input.workerConstraintTypeId),
      weighting: input.weighting,
      workerIds: input.workers.map(worker => Number(worker.id)),
    })
  }

  const onSuccess = () => {
    router.refresh()
  }

  return (
    <CreateDialog
      entityName="人員條件"
      form={form}
      submit={submit}
      onSuccess={onSuccess}
    >
      <CreateUpdateWorkerConstraintFields workerConstraintTypes={workerConstraintTypes} workers={workers} />
    </CreateDialog>
  )
}