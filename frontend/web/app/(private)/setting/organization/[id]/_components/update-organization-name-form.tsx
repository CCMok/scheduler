'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { UpdateOrganizationNameFormInput, updateOrganizationNameFormInputSchema } from "@/libs/client/organization/models/update-organization-name-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/external/shadcn/components/ui/card"
import FormSubmitButton from "@/components/form/form-submit-button"
import { Save } from "lucide-react"
import { Organization } from "@/external/prisma-generated"
import OrganizationNameField from "./organization-name-field"
import { UiMessageContent, UiMessageTitle } from "@/libs/share/_general/enums/ui-message"
import FormRootMessage from "@/components/form/form-root-message"
import { updateOrganizationNameAction } from "@/libs/server/organization/actions/update-organization-name-action"
import { UpdateOrganizationNameRequest } from "@/libs/server/organization/models/update-organization-name-request"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant"
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler"
import WarningDialog from "@/components/dialog/warning-dialog"
import { useState } from "react"

type Props = {
  organization: Organization;
}

export default function UpdateOrganizationNameForm({
  organization,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updateOrganizationNameFormInputSchema),
    defaultValues: {
      name: organization.name,
    }
  })

  const router = useRouter();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const onSubmit = async (input: UpdateOrganizationNameFormInput) => {
    const isValidInput = inputCheck(input)
    if (!isValidInput) return;

    setIsAlertDialogOpen(true)
  }

  const inputCheck = (input: UpdateOrganizationNameFormInput): boolean => {
    const isSameName = organization.name === input.name

    if (isSameName) {
      form.setError('name', {
        type: UiMessageTitle.INPUT_ERROR,
        message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱')
      });

      return false;
    }

    return true;
  }

  const onAlertDialogContinue = async () => {
    const input = form.getValues()
    const request: UpdateOrganizationNameRequest = {
      id: organization.id,
      name: input.name,
    }

    const response = await updateOrganizationNameAction(request)
    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success(UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已更改組織名稱',
    })

    form.reset();
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>組織名稱</CardTitle>
            <CardDescription>
              這是您的組織在 Scheduler 中的可見名稱。例如: 您公司的名稱。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OrganizationNameField />
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
          description='儲存後將更改組織名稱，請確認是否繼續。'
          onContinue={onAlertDialogContinue}
        />
      </form>
    </Form>
  )
}