'use client'

import UpdateDialog from "@/components/_general/dialog/update-dialog";
import { CreateUpdateWorkerConstraintFormInput, createUpdateWorkerConstraintFormInputSchema } from "@/libs/client/worker-constraint/models/create-update-worker-constraint-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateUpdateWorkerConstraintFields from "../form/create-update-worker-constraint-fields";
import { WorkerConstraintType, Worker } from "@/external/prisma-generated";
import { ServiceResponse } from "@/libs/server/_general/models/service-response";
import { updateWorkerConstraintAction } from "@/libs/server/worker-constraint/actions/update-worker-constraint-action";
import { useRouter } from "next/navigation";

type Props = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  defaultWorkerConstraintTypeId: string;
  defaultWeighting: number;
  defaultWorkerIds: string[];
  workerConstraintTypes: WorkerConstraintType[];
  workers: Worker[];
  id: number;
}

export default function UpdateWorkerConstraintDialog({
  isOpen,
  setIsOpen,
  defaultWorkerConstraintTypeId,
  defaultWeighting,
  defaultWorkerIds,
  workerConstraintTypes,
  workers,
  id,
}: Readonly<Props>) {
  const defaultWorkers = defaultWorkerIds.map(id => ({ id }))
  
  const form = useForm({
    resolver: zodResolver(createUpdateWorkerConstraintFormInputSchema),
    defaultValues: {
      workerConstraintTypeId: defaultWorkerConstraintTypeId,
      weighting: defaultWeighting,
      workers: defaultWorkers,
    },
  })

  const router = useRouter();

  const submit = async (input: CreateUpdateWorkerConstraintFormInput): Promise<ServiceResponse> => {
    return await updateWorkerConstraintAction({
      id,
      workerConstraintTypeId: Number(input.workerConstraintTypeId),
      weighting: input.weighting,
      workerIds: input.workers.map(worker => Number(worker.id)),
    })
  }
  
  const onSuccess = () => {
    router.refresh()
  }

  return (
    <UpdateDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      entityName="人員條件"
      submit={submit}
      form={form}
      onSuccess={onSuccess}
    >
      <CreateUpdateWorkerConstraintFields workerConstraintTypes={workerConstraintTypes} workers={workers} />
    </UpdateDialog>
  )
}