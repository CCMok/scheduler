'use client'

import { fetchData } from "@/libs/share/_general/utils/fetch"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Post, Worker } from "@/external/prisma-generated"
import ComboBox from "@/components/combobox/combo-box"
import { useFormContext } from "react-hook-form"
import { CreateWorkerPostFormInput } from "@/libs/client/post-worker/models/create-worker-post-form-input"
import { FormField } from "@/external/shadcn/components/ui/form"
import CustomFormItem from "@/components/form/custom-form-item"
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action"

type Props = {
  departmentId: number,
  existingPosts: Post[],
}

export default function CreateWorkerPostIdFormField({
  departmentId,
  existingPosts,
}: Readonly<Props>) {
  const { control, setValue } = useFormContext<CreateWorkerPostFormInput>();

  const isFirstRender = useRef(true)

  const router = useRouter()

  const [posts, setPosts] = useState<Worker[]>([])

  const fetchPosts = useCallback(async () => {
    const posts = await fetchData(
      async () => await getPostsAction({
        where: { departmentId },
        orderBy: [{ field: 'name' }],
      }),
      path => router.push(path),
      [],
    )

    const filteredPosts = posts.filter(post => !existingPosts.some(existingPost => existingPost.id === post.id))

    setPosts(filteredPosts)
  }, [departmentId, router, existingPosts])

  useEffect(() => {
    if (!isFirstRender.current) {
      return
    }

    fetchPosts()

    isFirstRender.current = false
  }, [fetchPosts])

  return (
    <FormField
      control={control}
      name='postId'
      render={({ field }) => (
        <CustomFormItem label='職位'>
          <ComboBox
            value={field.value}
            options={posts}
            getValue={option => option.id.toString()}
            getDisplayName={option => option.name}
            onValueChange={value => setValue('postId', value)}
            isFormField
          />
        </CustomFormItem>
      )}
    />
  )
}