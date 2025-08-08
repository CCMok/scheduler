'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { UiMessageContent, UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter } from "next/navigation";
import { UpdatePostNameFormInput, updatePostNameFormInputSchema } from "@/libs/client/post/models/update-post-name-form-input";
import { UpdatePostNameRequest } from "@/libs/server/post/models/update-post-name-request";
import { updatePostNameAction } from "@/libs/server/post/actions/update-post-name-action";
import { UiResponse } from "@/libs/share/_general/models/ui-response";

type Props = ChildrenProps & {
  postId: number;
  postName: string;
}

export default function UpdatePostNameForm({
  children,
  postId,
  postName,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updatePostNameFormInputSchema),
    defaultValues: {
      name: postName,
    },
  })

  const router = useRouter();

  const updatePost = async (input: UpdatePostNameFormInput): Promise<UiResponse> => {
    const request: UpdatePostNameRequest = {
      id: postId,
      name: input.name,
    }

    const response = await updatePostNameAction(request)

    return handleServiceResponse(response, path => router.push(path))
  }

  const onSubmit = async (input: UpdatePostNameFormInput) => {
    if (input.name === postName) {
      form.setError('name', {
        type: UiMessageTitle.INPUT_ERROR,
        message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱'),
      })
      return;
    }

    const uiResponse = await updatePost(input)
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('編輯職位名稱' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </Form>
  )
}