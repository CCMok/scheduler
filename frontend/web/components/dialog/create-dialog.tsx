'use client'

import { useState } from "react";
import CustomDialog from "./custom-dialog";
import CustomButton from "../button/custom-button";
import { Plus } from "lucide-react";
import FormSubmitButton from "../form/form-submit-button";
import { Form } from "@/external/shadcn/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";

type Props<T extends FieldValues = FieldValues, R = void> = ChildrenProps & {
  entityName?: string;
  form?: UseFormReturn<T>;
  submit?: (input: T) => Promise<ServiceResponse<R>>;
}

export default function CreateDialog<T extends FieldValues = FieldValues, R = void>({
  children,
  entityName = '',
  form,
  submit,
}: Readonly<Props<T, R>>) {
  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter();

  const onSubmit = async (input: T) => {
    if (!submit) return

    const response = await submit(input);
    const uiResponse = handleServiceResponse(response, path => router.push(path));
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success(`新增${entityName}` + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh()
    setIsOpen(false)
  }

  if (!form) return <></>

  return (
    <CustomDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={(
        <CustomButton onClick={() => setIsOpen(true)}>
          <Plus />
          新增
        </CustomButton>
      )}
      title={`新增${entityName}`}
      submitButton={(
        <FormSubmitButton>
          確定
        </FormSubmitButton>
      )}
      renderContent={content => (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {content}
          </form>
        </Form>
      )}
    >
      {children}
    </CustomDialog>
  )
}