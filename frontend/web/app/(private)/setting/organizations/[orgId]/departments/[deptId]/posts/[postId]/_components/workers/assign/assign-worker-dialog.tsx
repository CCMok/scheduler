'use client'

import CustomButton from "@/components/_general/button/custom-button";
import FormDialog from "@/components/_general/dialog/old-form-dialog";
import { CreatePostWorkerFormInput, createPostWorkerFormInputSchema } from "@/libs/client/post-worker/models/create-post-worker-form-input";
import { createPostWorkerAction } from "@/libs/server/post-worker/actions/create-post-worker-action";
import { Param } from "@/libs/share/_general/enums/param";
import { ServiceResponseStatus } from "@/libs/share/_general/enums/service-response-status";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPlus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AssignWorkerFields from "./assign-worker-fields";
import { Worker } from "@/external/prisma-generated";

type Props = {
  workers: Worker[];
}

export default function AssignWorkerDialog({
  workers,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createPostWorkerFormInputSchema),
    defaultValues: {
      workerId: '',
    },
  })

  const router = useRouter()

  const params = useParams()
  const postId = Number(params[Param.POST_ID])
  if (isNaN(postId)) {
    console.error(`postId is not found. postId: ${postId}`)
    return <></>
  }

  const submit = async (input: CreatePostWorkerFormInput): Promise<ServiceResponse> => {
    const workerId = Number(input.workerId)
    if (isNaN(workerId)) {
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
      <AssignWorkerFields workers={workers} />
    </FormDialog>
  )
}