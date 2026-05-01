'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Worker } from "@/external/prisma/generated/browser";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { useRouter } from "next/navigation";
import { FORM_FIELD, FORM_ID, formSchema } from "./update-worker-form-utils";
import { revalidateLogic } from "@tanstack/react-form";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { updateWorkerAction } from "@/libs/worker/update/update-worker-action";
import { toast } from "sonner";

export default function UpdateWorkerPanel({
  className,
  worker,
}: Readonly<{
  className?: string;
  worker: Worker;
}>) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.NAME]: worker.name,
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await updateWorkerAction({
        id: worker.id,
        name: value[FORM_FIELD.NAME],
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('更改職員資料成功')
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
          <CardTitle>職員資料</CardTitle>
          <CardDescription>更改職員的基本資料</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='lg:w-(--input-width)'>
            <form.AppField name={FORM_FIELD.NAME}>
              {(field) => (
                <field.TextField
                  label="名稱"
                  autoComplete="name"
                />
              )}
            </form.AppField>
            {/* TODO: Add posts, worker affinity */}
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
    </form >
  )
}