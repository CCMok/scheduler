'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { UiMessageContent, UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter } from "next/navigation";
import { UpdatePostFormInput, updatePostFormInputSchema } from "@/libs/client/post/models/update-post-form-input";
import { UpdatePostRequest } from "@/libs/server/post/models/update-post-request";
import { updatePostAction } from "@/libs/server/post/actions/update-post-action";
import { fetchPosts } from "@/libs/share/post/utils/fetch-posts-utils";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";

type Props = ChildrenProps & ClassNameProps & {
  setAlertIsOpen: (isOpen: boolean) => void,
  postId: number;
  postName: string;
}

export default function UpdatePostForm({
  children,
  className,
  setAlertIsOpen,
  postId,
  postName,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updatePostFormInputSchema),
    defaultValues: {
      postName,
    },
  })

  const router = useRouter();

  const departmentId = usePostSettingStore(state => state.departmentId);
  const setPosts = usePostSettingStore(state => state.setPosts);

  const onSubmit = async (input: UpdatePostFormInput) => {
    if (input.postName === postName) {
      form.setError('postName', {
        type: UiMessageTitle.INPUT_ERROR,
        message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱'),
      })
      return;
    }

    const request: UpdatePostRequest = {
      postId,
      postName: input.postName,
    }

    const response = await updatePostAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('編輯職位' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    const posts = await fetchPosts(Number(departmentId), path => router.push(path))
    setPosts(posts)

    setAlertIsOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}