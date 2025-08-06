'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { CreateWorkerFormInput, createWorkerFormInputSchema } from "@/libs/client/worker/models/create-worker-form-input";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useWorkerSettingStore } from "@/components/store/setting/worker/worker-setting-store-provider";
import { CreateWorkerRequest } from "@/libs/server/worker/models/create-worker-request";
import { createWorkerAction } from "@/libs/server/worker/actions/create-worker-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { fetchWorkers } from "@/libs/share/worker/utils/fetch-workers-utils";

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

  const onSubmit = async (input: CreateWorkerFormInput) => {
    const request: CreateWorkerRequest = {
      departmentId: Number(departmentId),
      workerName: input.workerName,
    }

    const response = await createWorkerAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('新增人員' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    const workers = await fetchWorkers(Number(departmentId), path => router.push(path))
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