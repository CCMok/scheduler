'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { FORM_FIELD, FORM_ID, formSchema } from "./update-worker-posts-form-utils"
import { revalidateLogic } from "@tanstack/react-form";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { Post } from "@/external/prisma/generated/client";
import { WorkerPost } from "@/libs/worker/worker";
import { updateWorkerPostsAction } from "@/libs/worker/update/posts/update-worker-posts-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdateWorkerPostsSection({
  className,
  worker,
  posts,
}: Readonly<{
  className?: string;
  worker: WorkerPost;
  posts: Post[];
}>) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.POSTS]: worker.posts.map((post) => post.id),
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await updateWorkerPostsAction({
        id: worker.id,
        posts: value[FORM_FIELD.POSTS],
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('更改職員的職位成功')
      // refresh with new data
      router.refresh();
    },
  })

  return (
    <form
      id={FORM_ID}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle>更改職位</CardTitle>
          <CardDescription>請選擇職員的職位</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='lg:w-(--input-width)'>
            <form.AppField name={FORM_FIELD.POSTS}>
              {(field) => (
                <field.MultipleComboboxField
                  label="職位"
                  options={posts}
                  getOptionValue={(post) => post.id}
                  getOptionDisplay={(post) => post.name}
                  placeholder="請選擇職位"
                />
              )}
            </form.AppField>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <form.AppForm>
            <Field className="[&>*]:w-full lg:[&>*]:w-fit">
              <form.SubmitButton icon={<Check />}>
                確定
              </form.SubmitButton>
            </Field>
          </form.AppForm>
        </CardFooter>
      </Card>
    </form>
  )
}