'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { CreatePostFormInput, createPostFormInputSchema } from "@/app/(private)/setting/organizations/[organizationId]/departments/[departmentId]/_components/posts/create/create-post-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreatePostFields from "./create-post-fields";
import { ServiceResponse } from "@/libs/_general/models/service-response";
import { createPostAction } from "@/libs/post/actions/create-post-action";
import { useRouter } from "next/navigation";

type Props = {
  departmentId: number;
}

export default function CreatePostButton({
  departmentId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createPostFormInputSchema),
    defaultValues: {
      postName: '',
    },
  })

  const router = useRouter();

  const submit = async (input: CreatePostFormInput): Promise<ServiceResponse<number>> => {
    return await createPostAction({
      departmentId,
      postName: input.postName,
    })
  }

  const onSuccess = () => {
    router.refresh()
  }

  return (
    <CreateDialog
      entityName="職位"
      form={form}
      submit={submit}
      onSuccess={onSuccess}
    >
      <CreatePostFields />
    </CreateDialog>
  )
}