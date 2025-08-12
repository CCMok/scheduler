'use client'

import { Form } from "@/external/shadcn/components/ui/form";
import { ChildrenProps } from "@/libs/share/_general/props/children-props";
import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { CreateWorkerPostFormInput, createWorkerPostFormInputSchema } from "@/libs/client/post-worker/models/create-worker-post-form-input";
import { CreatePostWorkerRequest } from "@/libs/server/post-worker/models/create-post-worker-request";
import { UiResponse } from "@/libs/share/_general/models/ui-response";
import { createPostWorkerAction } from "@/libs/server/post-worker/actions/create-post-worker-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { toast } from "sonner";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";

type Props = ChildrenProps & ClassNameProps & {
  setAlertIsOpen: (isOpen: boolean) => void,
  workerId: number,
}

export default function CreateWorkerPostForm({
  children,
  className,
  setAlertIsOpen,
  workerId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createWorkerPostFormInputSchema),
    defaultValues: {
      postId: '',
    },
  })

  const router = useRouter();

  const createPostWorker = async (input: CreateWorkerPostFormInput): Promise<UiResponse> => {
    const request: CreatePostWorkerRequest = {
      postId: Number(input.postId),
      workerId,
    }

    const response = await createPostWorkerAction(request)

    return handleServiceResponse(response, path => router.push(path))
  }

  const onSubmit = async (input: CreateWorkerPostFormInput) => {
    const uiResponse = await createPostWorker(input)
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('指派職位' + UiMessageTitle.SUCCESS, {
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