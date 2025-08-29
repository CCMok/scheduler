'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { CreateWorkerFormInput, createWorkerFormInputSchema } from "@/libs/client/worker/models/create-worker-form-input";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useWorkerSettingStore } from "@/app/(private)/setting/workers/_components/manage-worker/store/worker-setting-store-provider";
import { CreateWorkerRequest } from "@/libs/server/worker/models/create-worker-request";
import { createWorkerAction } from "@/libs/server/worker/actions/create-worker-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { GetWorkersRequest } from "@/libs/server/worker/models/get-workers-request";
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { UiResponse } from "@/libs/share/_general/models/ui-response";
import { Worker } from "@/external/prisma-generated";

type Props = ChildrenProps & ClassNameProps & {
  setAlertIsOpen: (isOpen: boolean) => void,
}

export default function CreateWorkerForm({
  children,
  className,
  setAlertIsOpen,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createWorkerFormInputSchema),
    defaultValues: {
      workerName: '',
    },
  })

  const departmentId = useWorkerSettingStore(state => state.departmentId);
  const setWorkers = useWorkerSettingStore(state => state.setWorkers);

  const router = useRouter();

  const createWorker = async (input: CreateWorkerFormInput): Promise<UiResponse> => {
    const request: CreateWorkerRequest = {
      departmentId: Number(departmentId),
      workerName: input.workerName,
    }

    const response = await createWorkerAction(request)

    return handleServiceResponse(response, path => router.push(path))
  }

  const fetchWorkers = async (): Promise<Worker[]> => {
    const request: GetWorkersRequest = {
      where: { departmentId: Number(departmentId) },
    }

    return await fetchData(
      async () => await getWorkersAction(request),
      path => router.push(path),
      [],
    )
  }

  const onSubmit = async (input: CreateWorkerFormInput) => {
    const uiResponse = await createWorker(input)
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('新增人員' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    const workers = await fetchWorkers();
    setWorkers(workers)

    setAlertIsOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}