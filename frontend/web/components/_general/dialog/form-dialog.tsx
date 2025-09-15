'use client'

import { ReactNode, useState } from "react";
import CustomDialog from "./custom-dialog";
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

type Props<T extends FieldValues = FieldValues, R = object> = ChildrenProps & {
  form?: UseFormReturn<T>;
  submit?: (input: T) => Promise<ServiceResponse<R>>;
  onSuccess?: (data: R) => (void | Promise<void>);
  title?: string;
  renderTrigger?: (onClick: () => (void | Promise<void>)) =>ReactNode;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function FormDialog<T extends FieldValues = FieldValues, R = object>({
  children,
  form,
  submit,
  onSuccess,  
  title = '',
  renderTrigger,
  isOpen,
  setIsOpen,
}: Readonly<Props<T, R>>) {
  const [isOpenDefault, setIsOpenDefault] = useState(false)

  const isOpenFinal = isOpen ?? isOpenDefault;
  const setIsOpenFinal = (isOpen: boolean) => {
    const callback = setIsOpen ?? setIsOpenDefault;
    callback(isOpen);
    form?.reset();
  }

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

    toast.success(title + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    setIsOpenFinal(false)

    await onSuccess?.(uiResponse.data);
  }

  if (!form) return <></>

  const trigger = renderTrigger ? renderTrigger(() => setIsOpenFinal(true)) : <></>

  return (
    <CustomDialog
      isOpen={isOpenFinal}
      setIsOpen={setIsOpenFinal}
      trigger={trigger}
      title={title}
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