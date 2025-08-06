'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { AddWorkerFormInput, addWorkerFormInputSchema } from "@/libs/client/worker/models/add-worker-form-input";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useWorkerSettingStore } from "@/components/store/setting/worker/worker-setting-store-provider";
import { AddWorkerRequest } from "@/libs/server/worker/models/add-worker-request";
import { addWorkerAction } from "@/libs/server/worker/actions/add-worker-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";

type Props = ChildrenProps & ClassNameProps & {
  setAlertIsOpen: (isOpen: boolean) => void,
}

export default function AddWorkerForm({
  children,
  className,
  setAlertIsOpen,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(addWorkerFormInputSchema),
    defaultValues: {
      workerName: '',
    },
  })

  const departmentId = useWorkerSettingStore(state => state.departmentId);

  const router = useRouter();

  const onSubmit = async (input: AddWorkerFormInput) => {
    const request: AddWorkerRequest = {
      departmentId: Number(departmentId),
      workerName: input.workerName,
    }

    const response = await addWorkerAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('新增人員' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    setAlertIsOpen(false)

    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}