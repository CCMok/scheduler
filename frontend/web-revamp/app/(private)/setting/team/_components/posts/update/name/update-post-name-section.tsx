'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Post } from "@/external/prisma/generated/browser";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { useRouter } from "next/navigation";
import { FORM_FIELD, FORM_ID, formSchema } from "./update-post-name-form-utils"
import { revalidateLogic } from "@tanstack/react-form";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { updatePostNameAction } from "@/libs/post/update/name/update-post-name-action";
import { toast } from "sonner";

export default function UpdatePostNameSection({
  className,
  post,
}: Readonly<{
  className?: string;
  post: Post;
}>) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.NAME]: post.name,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await updatePostNameAction({
        id: post.id,
        name: value[FORM_FIELD.NAME],
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('更改職位名稱成功')
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
          <CardTitle>名稱</CardTitle>
          <CardDescription>在值班表顯示的名稱。</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='lg:w-(--input-width)'>
            <form.AppField name={FORM_FIELD.NAME}>
              {(field) => (
                <field.TextField
                  autoComplete="name"
                  showLabel={false}
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