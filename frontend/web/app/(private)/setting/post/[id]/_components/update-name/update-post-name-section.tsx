'use client'

import { Post } from "@/external/prisma-generated"
import UpdateNameLayout from "@/components/layout/update-name/update-name-layout"
import { UpdateNameFormInput } from "@/libs/client/setting/models/update-name-form-input"
import { ServiceResponse } from "@/libs/share/_general/models/service-response"
import { UpdatePostNameRequest } from "@/libs/server/post/models/update-post-name-request"
import { updatePostNameAction } from "@/libs/server/post/actions/update-post-name-action"

type Props = {
  post: Post;
}

export default function UpdatePostNameSection({
  post,
}: Readonly<Props>) {
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