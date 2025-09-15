'use client'

import UpdateDialog from "@/components/_general/dialog/update-dialog";
import { updatePostConstraintFormInputSchema } from "@/libs/client/post-constraint/models/update-post-constraint-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import UpdatePostConstraintFields from "./update-post-constraint-fields";
import { PostConstraintType, Post } from "@/external/prisma-generated";

type Props = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  defaultPostConstraintTypeId: string;
  defaultWeighting: number;
  defaultPostIds: string[];
  postConstraintTypes: PostConstraintType[];
  posts: Post[];
}

export default function UpdatePostConstraintDialog({
  isOpen,
  setIsOpen,
  defaultPostConstraintTypeId,
  defaultWeighting,
  defaultPostIds,
  postConstraintTypes,
  posts,
}: Readonly<Props>) {
  const defaultPosts = defaultPostIds.map(id => ({ id }))
  
  const form = useForm({
    resolver: zodResolver(updatePostConstraintFormInputSchema),
    defaultValues: {
      postConstraintTypeId: defaultPostConstraintTypeId,
      weighting: defaultWeighting,
      posts: defaultPosts,
    },
  })

  return (
    <UpdateDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      entityName="職位條件"
      submit={undefined} // TODO
      form={form}
    >
      <UpdatePostConstraintFields postConstraintTypes={postConstraintTypes} posts={posts} />
    </UpdateDialog>
  )
}