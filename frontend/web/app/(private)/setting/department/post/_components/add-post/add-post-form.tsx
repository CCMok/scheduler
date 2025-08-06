'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { AddPostFormInput, addPostFormInputSchema } from "@/libs/client/post/models/add-post-form-input";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AddPostRequest } from "@/libs/server/post/models/add-post-request";
import { addPostAction } from "@/libs/server/post/actions/add-post-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter } from "next/navigation";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";

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

  const router = useRouter();

  const onSubmit = async (input: AddPostFormInput) => {
    const request: AddPostRequest = {
      departmentId: Number(departmentId),
      postName: input.postName,
    }

    const response = await addPostAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('新增職位' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    setAlertIsOpen(false)

    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}