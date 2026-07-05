'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { FORM_FIELD, FORM_ID, formSchema } from "./update-post-workers-form-utils"
import { revalidateLogic } from "@tanstack/react-form";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { Worker } from "@/external/prisma/generated/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostWorker } from "@/libs/post/post";
import { updatePostWorkersAction } from "@/libs/post/update/workers/update-post-workers-action";

export default function UpdatePostWorkersSection({
  className,
  post,
  workers,
}: Readonly<{
  className?: string;
  post: PostWorker;
  workers: Worker[];
}>) {
  const router = useRouter();
  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.WORKERS]: post.workers.map((w) => w.id),
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await updatePostWorkersAction({
        id: post.id,
        workers: value[FORM_FIELD.WORKERS],
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('更改職位的職員成功')
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
          <CardTitle>職員</CardTitle>
          <CardDescription>將會依照設定，自動編排值班表。可選多於一個職員。</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='lg:w-(--input-width)'>
            <form.AppField name={FORM_FIELD.WORKERS}>
              {(field) => (
                <field.MultipleComboboxField
                  options={workers}
                  getOptionValue={(w) => w.id}
                  getOptionDisplay={(w) => w.name}
                  placeholder="請選擇職員"
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