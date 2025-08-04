'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { AddPostFormInput, addPostFormInputSchema } from "@/libs/client/post/models/add-post-form-input";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddPostRequest } from "@/libs/server/post/models/add-post-request";
import { addPostAction } from "@/libs/server/post/actions/add-post-action";
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook";
import { ServerResponse } from "@/libs/share/_general/models/server-response";
import { ClientMessage } from "@/libs/client/_general/models/client-message";
import { isNil } from "lodash";
import { SYSTEM_ERROR_CLIENT_MESSAGE } from "@/libs/client/_general/utils/server-response-handler";
import { ClientMessageTitle } from "@/libs/client/_general/enums/client-message-enum";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter, useSearchParams } from "next/navigation";
import { SEARCH_PARAM_DEPARTMENT_ID } from "../post-setting-search-param";

type Props = ChildrenProps & ClassNameProps & {
  setAlertIsOpen: (isOpen: boolean) => void,
}

export default function AddPostForm({
  children,
  className,
  setAlertIsOpen,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(addPostFormInputSchema),
    defaultValues: {
      postName: '',
    },
  })

  const searchParams = useSearchParams();
  const departmentId = searchParams.get(SEARCH_PARAM_DEPARTMENT_ID);

  const { handleServerResponse } = useServerResponseHandler();

  const router = useRouter();

  const onSubmit = async (input: AddPostFormInput) => {
    if (isNil(departmentId) || isNaN(Number(departmentId))) {
      console.error('departmentId is not valid. departmentId: ', departmentId)

      form.setError('root', {
        type: SYSTEM_ERROR_CLIENT_MESSAGE.title,
        message: SYSTEM_ERROR_CLIENT_MESSAGE.content
      })

      return;
    }

    const request: AddPostRequest = {
      departmentId: Number(departmentId),
      postName: input.postName,
    }

    const response = await addPostAction(request)

    await handleServerResponse(response, onSuccess, onError)
  }

  const onSuccess = async () => {
    toast.success('新增職位' + ClientMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    setAlertIsOpen(false)

    router.refresh()
  }

  const onError = (_: ServerResponse, clientMessage: ClientMessage) => {
    form.setError('root', { type: clientMessage.title, message: clientMessage.content })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}