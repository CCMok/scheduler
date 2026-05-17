'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { revalidateLogic } from "@tanstack/react-form";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { Post } from "@/external/prisma/generated/client";
import { useRouter } from "next/navigation";
import { FORM_FIELD, FORM_ID, formSchema } from "./update-post-status-form-utils";
import { PostStatus } from "@/libs/post/post-status";
import { updatePostStatusAction } from "@/libs/post/update/status/update-post-status-action";
import { toast } from "sonner";

export default function UpdatePostStatusSection({
  className,
  post,
}: Readonly<{
  className?: string;
  post: Post;
}>) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.STATUS]: post.status === PostStatus.ACTIVE,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await updatePostStatusAction({
        id: post.id,
        status: value[FORM_FIELD.STATUS] ? PostStatus.ACTIVE : PostStatus.INACTIVE,
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('更改職位的狀態成功')
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
          <CardTitle>狀態</CardTitle>
          <CardDescription>若設為停用，在自動編排值班表中，將不會考慮該職位。</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='w-20'>
            <form.AppField name={FORM_FIELD.STATUS}>
              {(field) => (
                <field.SwitchField
                  label='啟用'
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