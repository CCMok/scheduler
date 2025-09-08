'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { CreatePostFormInput, createPostFormInputSchema } from "@/libs/client/post/models/create-post-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreatePostFields from "./create-post-fields";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { createPostAction } from "@/libs/server/post/actions/create-post-action";

type Props = {
  deptId: number;
}

export default function CreatePostButton({
  deptId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createPostFormInputSchema),
    defaultValues: {
      postName: '',
    },
  })

  const submit = async (input: CreatePostFormInput): Promise<ServiceResponse> => {
    return await createPostAction({
      departmentId: Number(deptId),
      postName: input.postName,
    })
  }

  // TODO: fix success submit cannot refresh post sequence table. Due to store init issue

  return (
    <CreateDialog
      entityName="職位"
      form={form}
      submit={submit}
    >
      <CreatePostFields />
    </CreateDialog>
  )
}