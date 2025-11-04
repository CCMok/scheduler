'use client'

import CustomButton from "@/components/_general/button/custom-button";
import FormDialog from "@/components/_general/dialog/form-dialog";
import { CreatePostWorkerFormInput, createPostWorkerFormInputSchema } from "@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/posts/[postId]/_components/workers/assign/create-post-worker-form-input";
import { createPostWorkerAction } from "@/libs/post-worker/actions/create-post-worker-action";
import { ServiceResponse } from "@/libs/_general/models/service-response";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import AssignWorkerFields from "./assign-worker-fields";
import { Worker } from "@/external/prisma-generated";

type Props = {
  workers: Worker[];
  postId: number;
}

export default function AssignWorkerDialog({
  workers,
  postId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createPostWorkerFormInputSchema),
    defaultValues: {
      workerId: undefined,
    },
  })

  const router = useRouter()

  const submit = async (input: CreatePostWorkerFormInput): Promise<ServiceResponse> => {
    return await createPostWorkerAction({
      workerId: input.workerId,
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
      title='指派職位'
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