'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { AddPostFormInput, addPostFormInputSchema } from "@/libs/client/post/models/add-post-form-input";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddPostRequest } from "@/libs/server/post/models/add-post-request";
import { addPostAction } from "@/libs/server/post/actions/add-post-action";
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response";
import { ClientMessage } from "@/libs/client/_general/models/client-message";
import { isNil } from "lodash";
import { SYSTEM_ERROR_CLIENT_MESSAGE } from "@/libs/client/_general/utils/server-response-handler";
import { ClientMessageTitle } from "@/libs/client/_general/enums/client-message-enum";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useFetchPosts } from "@/libs/client/post/hooks/use-fetch-posts";
import { useCallback } from "react";
import { Post } from "@/external/prisma-generated";

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

  const departmentId = usePostSettingStore(state => state.departmentId);
  const setPosts = usePostSettingStore(state => state.setPosts);

  const { handleServerResponse } = useServerResponseHandler();

  const onFetchPostSuccess = useCallback((response: SuccessResponse<Post[]>) => {
    setPosts(response.data)
  }, [setPosts])

  const onFetchPostError = useCallback((_: ServerResponse, clientMessage: ClientMessage) => {
    toast.success(SYSTEM_ERROR_CLIENT_MESSAGE.title, {
      ...SONNER_DEFAULT_OPTIONS,
      description: clientMessage.content,
    })
  }, [])

  const { fetchPosts } = useFetchPosts(onFetchPostSuccess, onFetchPostError);

  const onSubmit = async (input: AddPostFormInput) => {
    if (isNil(departmentId)) {
      form.setError('root', {
        type: SYSTEM_ERROR_CLIENT_MESSAGE.title,
        message: SYSTEM_ERROR_CLIENT_MESSAGE.content
      })

      return;
    }

    const request: AddPostRequest = {
      departmentId,
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

    await fetchPosts({ departmentId: Number(departmentId) })
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