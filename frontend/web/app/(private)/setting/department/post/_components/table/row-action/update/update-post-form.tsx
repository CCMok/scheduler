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
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { UiResponse } from "@/libs/share/_general/models/ui-response";
import { Post } from "@/external/prisma-generated";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action";

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

  const updatePost = async (input: UpdatePostFormInput): Promise<UiResponse> => {
    const request: UpdatePostRequest = {
      postId,
      postName: input.postName,
    }

    const response = await updatePostAction(request)

    return handleServiceResponse(response, path => router.push(path))
  }

  const fetchPosts = async (): Promise<Post[]> => {
    const request: GetPostsRequest = {
      where: { departmentId },
    }

    return await fetchData(
      async () => await getPostsAction(request),
      path => router.push(path)
    )
  }

  const onSubmit = async (input: UpdatePostFormInput) => {
    if (input.postName === postName) {
      form.setError('postName', {
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

    toast.success('編輯職位' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    const posts = await fetchPosts()
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