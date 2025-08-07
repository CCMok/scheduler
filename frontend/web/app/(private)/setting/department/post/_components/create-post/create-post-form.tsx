'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { CreatePostFormInput, createPostFormInputSchema } from "@/libs/client/post/models/create-post-form-input";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CreatePostRequest } from "@/libs/server/post/models/create-post-request";
import { createPostAction } from "@/libs/server/post/actions/create-post-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter } from "next/navigation";
import { usePostSettingStore } from "@/components/store/setting/post/post-setting-store-provider";
import { UiResponse } from "@/libs/share/_general/models/ui-response";
import { GetPostsRequest } from "@/libs/server/post/models/get-posts-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { Post } from "@/external/prisma-generated";
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action";

type Props = ChildrenProps & ClassNameProps & {
  setAlertIsOpen: (isOpen: boolean) => void,
}

export default function CreatePostForm({
  children,
  className,
  setAlertIsOpen,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createPostFormInputSchema),
    defaultValues: {
      postName: '',
    },
  })

  const departmentId = usePostSettingStore(state => state.departmentId);
  const setPosts = usePostSettingStore(state => state.setPosts);

  const router = useRouter();

  const createPost = async (input: CreatePostFormInput): Promise<UiResponse> => {
    const request: CreatePostRequest = {
      departmentId: Number(departmentId),
      postName: input.postName,
    }

    const response = await createPostAction(request)

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

  const onSubmit = async (input: CreatePostFormInput) => {
    const uiResponse = await createPost(input)
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('新增職位' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    setAlertIsOpen(false)

    const posts = await fetchPosts()
    setPosts(posts)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </Form>
  )
}