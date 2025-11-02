'use client'

import UpdateDialog from "@/components/_general/dialog/update-dialog";
import { CreateUpdatePostConstraintFormInput, createUpdatePostConstraintFormInputSchema } from "@/libs/client/post-constraint/models/create-update-post-constraint-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CreateUpdatePostConstraintFields from "../form/create-update-post-constraint-fields";
import { PostConstraintType, Post } from "@/external/prisma-generated";
import { ServiceResponse } from "@/libs/server/_general/models/service-response";
import { updatePostConstraintAction } from "@/libs/server/post-constraint/actions/update-post-constraint-action";
import { useRouter } from "next/navigation";

type Props = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  defaultPostConstraintTypeId: string;
  defaultWeighting: number;
  defaultPostIds: string[];
  postConstraintTypes: PostConstraintType[];
  posts: Post[];
  id: number;
}

export default function UpdatePostConstraintDialog({
  isOpen,
  setIsOpen,
  defaultPostConstraintTypeId,
  defaultWeighting,
  defaultPostIds,
  postConstraintTypes,
  posts,
  id,
}: Readonly<Props>) {
  const defaultPosts = defaultPostIds.map(id => ({ id }))
  
  const form = useForm({
    resolver: zodResolver(createUpdatePostConstraintFormInputSchema),
    defaultValues: {
      postConstraintTypeId: defaultPostConstraintTypeId,
      weighting: defaultWeighting,
      posts: defaultPosts,
    },
  })

  const router = useRouter();

  const submit = async (input: CreateUpdatePostConstraintFormInput): Promise<ServiceResponse> => {
    return await updatePostConstraintAction({
      id,
      postConstraintTypeId: Number(input.postConstraintTypeId),
      weighting: input.weighting,
      postIds: input.posts.map(post => Number(post.id)),
    })
  }
  
  const onSuccess = () => {
    router.refresh()
  }

  return (
    <UpdateDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      entityName="職位條件"
      submit={submit}
      form={form}
      onSuccess={onSuccess}
    >
      <CreateUpdatePostConstraintFields postConstraintTypes={postConstraintTypes} posts={posts} />
    </UpdateDialog>
  )
}