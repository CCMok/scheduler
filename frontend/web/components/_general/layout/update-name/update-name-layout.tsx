'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import FormSubmitButton from '@/components/_general/form/form-submit-button'
import { Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant"
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog'
import { useState } from "react"
import { UpdateNameFormInput, updateNameFormInputSchema } from "@/libs/_general/models/update-name-form-input"
import NameField from "./name-field"
import CustomCard from "../../card/custom-card"
import { ServiceResponse } from "@/libs/_general/models/service-response"
import { MessageContent, MessageTitle } from "@/libs/_general/enums/message"
import { handleCudResponse } from "@/libs/_general/utils/response-utils"
import { isNil } from "lodash"

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
      type: MessageTitle.INPUT_ERROR,
      message: MessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱')
    });

    return false;
  }

  const onConfirm = async () => {
    const response = await submit(form.getValues())

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success(`更改${entityName}名稱` + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CustomCard
          title={`${entityName}名稱`}
          footer={(
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          )}
        >
          <NameField />
        </CustomCard>

        <ConfirmDialog
          isOpen={isAlertDialogOpen}
          setIsOpen={setIsAlertDialogOpen}
          title='確定要儲存嗎?'
          description={`儲存後將更改${entityName}名稱，請確認是否繼續。`}
          onConfirm={onConfirm}
        />
      </form>
    </Form>
  )
}