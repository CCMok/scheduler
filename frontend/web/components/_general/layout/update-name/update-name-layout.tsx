'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/external/shadcn/components/ui/card"
import FormSubmitButton from '@/components/_general/form/form-submit-button'
import { Save } from "lucide-react"
import { UiMessageContent, UiMessageTitle } from "@/libs/share/_general/enums/ui-message"
import FormRootMessage from '@/components/_general/form/form-root-message'
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"
import WarningDialog from '@/components/_general/dialog/warning-dialog'
import { useState } from "react"
import { UpdateNameFormInput, updateNameFormInputSchema } from "@/libs/client/setting/models/update-name-form-input"
import { ServiceResponse } from "@/libs/share/_general/models/service-response"
import NameField from "./name-field"

type Props = {
  entityName: string;
  originalName: string;
  submit: (input: UpdateNameFormInput) => Promise<ServiceResponse>;
}

export default function UpdateNameLayout({
  entityName,
  originalName,
  submit,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updateNameFormInputSchema),
    defaultValues: {
      name: originalName,
    }
  })

  const router = useRouter();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const onSubmit = async (input: UpdateNameFormInput) => {
    const isPassNameCheck = sameNameCheck(input)
    if (!isPassNameCheck) return;
    setIsAlertDialogOpen(true)
  }

  const sameNameCheck = (input: UpdateNameFormInput): boolean => {
    if (originalName !== input.name) return true;

    form.setError('name', {
      type: UiMessageTitle.INPUT_ERROR,
      message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱')
    });

    return false;
  }

  const onConfirm = async () => {
    const response = await submit(form.getValues())

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success(UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: `已更改${entityName}名稱`,
    })

    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{entityName}名稱</CardTitle>
          </CardHeader>
          <CardContent>
            <NameField />
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
          description={`儲存後將更改${entityName}名稱，請確認是否繼續。`}
          onContinue={onConfirm}
        />
      </form>
    </Form>
  )
}