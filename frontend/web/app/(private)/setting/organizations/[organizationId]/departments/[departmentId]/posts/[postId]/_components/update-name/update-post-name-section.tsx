'use client'

import { Post } from "@/external/prisma-generated"
import UpdateNameLayout from '@/components/_general/layout/update-name/update-name-layout'
import { UpdateNameFormInput } from "@/libs/_general/models/update-name-form-input"
import { ServiceResponse } from "@/libs/_general/models/service-response"
import { UpdatePostNameRequest } from "@/libs/post/models/update-post-name-request"
import { updatePostNameAction } from "@/libs/post/actions/update-post-name-action"
import { use } from "react"
import { notFound } from "next/navigation"

type Props = {
  postPromise: Promise<Post | undefined>;
}

export default function UpdatePostNameSection({
  postPromise,
}: Readonly<Props>) {
  const post = use(postPromise);
  if (!post) notFound()

  const submit = async (input: UpdateNameFormInput): Promise<ServiceResponse> => {
    const request: UpdatePostNameRequest = {
      id: post.id,
      name: input.name,
    }

    return await updatePostNameAction(request)
  }

  return (
    <UpdateNameLayout
      entityName="職位"
      originalName={post.name}
      submit={submit}
    />
  )
}