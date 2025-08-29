'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Save } from "lucide-react";
import WorkerNameField from "./worker-name-field";
import FormRootMessage from "@/components/form/form-root-message";
import FormSubmitButton from "@/components/form/form-submit-button";
import { Form } from "@/external/shadcn/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { UiMessageContent, UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter } from "next/navigation";
import { UpdateWorkerNameFormInput, updateWorkerNameFormInputSchema } from "@/libs/client/worker/models/update-worker-name-form-input";
import { UpdateWorkerNameRequest } from "@/libs/server/worker/models/update-worker-name-request";
import { updateWorkerNameAction } from "@/libs/server/worker/actions/update-worker-name-action";
import { UiResponse } from "@/libs/share/_general/models/ui-response";
import { useState } from "react";
import WarningDialog from "@/components/dialog/warning-dialog";
import { useWorkerUpdateStore } from "@/app/(private)/setting/worker/[id]/edit/_components/store/worker-update-store-provider";

export default function WorkerUpdateNameSection() {
  const workerId = useWorkerUpdateStore(state => state.workerId)
  const workerName = useWorkerUpdateStore(state => state.workerName)

  const form = useForm({
    resolver: zodResolver(updateWorkerNameFormInputSchema),
    defaultValues: {
      name: workerName,
    },
  })

  const router = useRouter();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  const onSubmit = async (input: UpdateWorkerNameFormInput) => {
    if (input.name === workerName) {
      form.setError('name', {
        type: UiMessageTitle.INPUT_ERROR,
        message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱'),
      })
      return;
    }

    setIsAlertDialogOpen(true)
  }

  const onAlertDialogContinue = async () => {
    const input = form.getValues()

    const uiResponse = await updateWorker(input)
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('編輯人員名稱' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh()
  }

  const updateWorker = async (input: UpdateWorkerNameFormInput): Promise<UiResponse> => {
    const request: UpdateWorkerNameRequest = {
      id: workerId,
      name: input.name,
    }

    const response = await updateWorkerNameAction(request)

    return handleServiceResponse(response, path => router.push(path))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>人員名稱</CardTitle>
            <CardDescription>
              這是您的人員在 Scheduler 中的可見名稱。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WorkerNameField workerName={workerName} />
          </CardContent>
          <CardFooter className='flex space-x-4'>
            <FormRootMessage />
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          </CardFooter>
        </Card>
        <WarningDialog
          isOpen={isAlertDialogOpen}
          setIsOpen={setIsAlertDialogOpen}
          title='確定要儲存嗎?'
          description='儲存後將更改人員名稱，請確認是否繼續。'
          onContinue={onAlertDialogContinue}
        />
      </form>
    </Form>
  )
}