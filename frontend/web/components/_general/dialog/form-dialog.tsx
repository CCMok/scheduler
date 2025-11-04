'use client'

import { ReactNode, useState } from "react";
import CustomDialog from "./custom-dialog";
import FormSubmitButton from "../form/form-submit-button";
import { Form } from "@/external/shadcn/components/ui/form";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { ServiceResponse } from "@/libs/_general/models/service-response";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { ChildrenProps } from "@/libs/_general/props/children-props";
import { handleCudResponse } from "@/libs/_general/utils/response-utils";
import { MessageTitle } from "@/libs/_general/enums/message";
import { isNil } from "lodash";

type Props<T extends FieldValues = FieldValues, R = object> = ChildrenProps & {
  form?: UseFormReturn<T>;
  submit?: (input: T) => Promise<ServiceResponse<R>>;
  onSuccess?: (data: R) => (void | Promise<void>);
  title?: string;
  renderTrigger?: (onClick: () => (void | Promise<void>)) => ReactNode;
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
    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success(title + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    setIsOpenFinal(false)

    await onSuccess?.(data);
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