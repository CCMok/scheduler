'use client'

import CustomButton from "@/components/_general/button/custom-button";
import FormDialog from "@/components/_general/dialog/form-dialog";
import { createPostWorkerAction } from "@/libs/server/post-worker/actions/create-post-worker-action";
import { Param } from "@/libs/share/_general/enums/param";
import { ServiceResponseStatus } from "@/libs/share/_general/enums/service-response-status";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Post } from "@/external/prisma-generated";
import { CreateWorkerPostFormInput, createWorkerPostFormInputSchema } from "@/libs/client/post-worker/models/create-worker-post-form-input";
import AssignPostFields from "./assign-post-fields";

type Props = {
  posts: Post[];
}

export default function AssignPostDialog({
  posts,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createWorkerPostFormInputSchema),
    defaultValues: {
      postId: '',
    },
  })

  const router = useRouter()

  const params = useParams()
  const workerId = Number(params[Param.WORKER_ID])
  if (isNaN(workerId)) {
    console.error(`workerId is not found. workerId: ${workerId}`)
    return <></>
  }

  const submit = async (input: CreateWorkerPostFormInput): Promise<ServiceResponse> => {
    const postId = Number(input.postId)
    if (isNaN(postId)) {
      return {
        status: ServiceResponseStatus.INTERNAL_ERROR,
      }
    }

    return await createPostWorkerAction({
      workerId,
      postId,
    })
  }

  const onSuccess = () => {
    router.refresh()
  }

  return (
    <FormDialog
      form={form}
      submit={submit}
      onSuccess={onSuccess}
      title={'指派職位'}
      renderTrigger={onClick => (
        <CustomButton onClick={onClick}>
          <UserRoundPlus />
          指派職位
        </CustomButton>
      )}
    >
      <AssignPostFields posts={posts} />
    </FormDialog>
  )
}