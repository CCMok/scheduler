'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { CreatePostFormInput, createPostFormInputSchema } from "@/app/(private)/setting/organizations/[orgId]/departments/[deptId]/_components/posts/create/create-post-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreatePostFields from "./create-post-fields";
import { ServiceResponse } from "@/libs/_general/models/service-response";
import { createPostAction } from "@/libs/post/actions/create-post-action";
import { useParams, useRouter } from "next/navigation";
import { Param } from '@/libs/_general/enums/param';

export default function CreatePostButton() {
  const form = useForm({
    resolver: zodResolver(createPostFormInputSchema),
    defaultValues: {
      postName: '',
    },
  })

  const router = useRouter();

  const params = useParams();
  const orgId = Number(params[Param.ORG_ID]);
  const deptId = Number(params[Param.DEPT_ID]);

  if (isNaN(orgId) || isNaN(deptId)) {
    console.error(`orgId or deptId is not found. orgId: ${orgId} deptId: ${deptId}`)
    return <></>
  }

  const submit = async (input: CreatePostFormInput): Promise<ServiceResponse<number>> => {
    return await createPostAction({
      departmentId: deptId,
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