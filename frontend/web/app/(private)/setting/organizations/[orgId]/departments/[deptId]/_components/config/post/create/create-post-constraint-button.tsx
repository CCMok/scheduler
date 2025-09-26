'use client'

import CreateDialog from '@/components/_general/dialog/create-dialog';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ServiceResponse } from "@/libs/share/_general/models/service-response";
import { useRouter } from "next/navigation";
import { Id } from '@/libs/server/_general/models/id';
import { CreateUpdatePostConstraintFormInput, createUpdatePostConstraintFormInputSchema } from '@/libs/client/post-constraint/models/create-update-post-constraint-form-input';
import CreateUpdatePostConstraintFields from '../form/create-update-post-constraint-fields';
import { PostConstraintType, Post } from '@/external/prisma-generated';
import { createPostConstraintAction } from '@/libs/server/post-constraint/actions/create-post-constraint-action';

type Props = {
  postConstraintTypes: PostConstraintType[];
  posts: Post[];
  departmentId: number;
}

export default function CreatePostConstraintButton({
  postConstraintTypes,
  posts,
  departmentId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createUpdatePostConstraintFormInputSchema),
    defaultValues: {
      postConstraintTypeId: '',
      weighting: 1,
      posts: [],
    },
  })

  const router = useRouter();

  const submit = async (input: CreateUpdatePostConstraintFormInput): Promise<ServiceResponse<Id>> => {
    return await createPostConstraintAction({
      departmentId,
      postConstraintTypeId: Number(input.postConstraintTypeId),
      weighting: input.weighting,
      postIds: input.posts.map(post => Number(post.id)),
    })
  }

  const onSuccess = () => {
    router.refresh()
  }

  return (
    <CreateDialog
      entityName="職位條件"
      form={form}
      submit={submit}
      onSuccess={onSuccess}
    >
      <CreateUpdatePostConstraintFields postConstraintTypes={postConstraintTypes} posts={posts} />
    </CreateDialog>
  )
}