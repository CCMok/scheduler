'use client';

import { Form } from "@/external/shadcn/components/ui/form";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateWorkerAction } from "@/libs/server/worker/actions/update-worker-action";
import { UpdateWorkerRequest } from "@/libs/server/worker/models/update-worker-request";
import { UiMessageTitle, UiMessageContent } from "@/libs/share/_general/enums/ui-message";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";
import { UpdateWorkerFormInput, updateWorkerFormInputSchema } from "@/libs/client/worker/models/update-worker-form-input";
import { fetchWorkers } from "@/libs/share/worker/utils/fetch-workers-utils";
import { useWorkerSettingStore } from "@/components/store/setting/worker/worker-setting-store-provider";

type Props = PropsWithChildren<{
  setAlertIsOpen: (isOpen: boolean) => void;
  className?: string;
  workerId: number;
  workerName: string;
}>;

export default function UpdateWorkerForm({
  children,
  setAlertIsOpen,
  className,
  workerId,
  workerName,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updateWorkerFormInputSchema),
    defaultValues: {
      workerName: workerName,
    },
  });

  const router = useRouter();

  const departmentId = useWorkerSettingStore(state => state.departmentId);
  const setWorkers = useWorkerSettingStore(state => state.setWorkers);

  const onSubmit = async (input: UpdateWorkerFormInput) => {
    if (input.workerName === workerName) {
      form.setError('workerName', {
        type: UiMessageTitle.INPUT_ERROR,
        message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱'),
      })
      return;
    }

    const request: UpdateWorkerRequest = {
      workerId,
      workerName: input.workerName,
    }

    const response = await updateWorkerAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('編輯職位' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    const workers = await fetchWorkers(Number(departmentId), path => router.push(path))
    setWorkers(workers)

    setAlertIsOpen(false)
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  );
}