'use client'

import { cn } from "@/external/shadcn/libs/utils";
import { Worker } from "@/external/prisma/generated/client";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { revalidateLogic } from "@tanstack/react-form";
import { FORM_FIELD, FORM_ID, formSchema } from "./create-post-form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { createPostAction } from "@/libs/post/create/create-post-action";
import { toast } from "sonner";

export default function CreatePostPanel({
  className,
  workers,
  teamId,
  onSuccess,
}: Readonly<{
  className?: string;
  workers: Worker[];
  teamId: number;
  onSuccess?: (id: number) => void;
}>) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.NAME]: '',
      [FORM_FIELD.WORKERS]: [] as number[],
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await createPostAction({
        teamId,
        name: value[FORM_FIELD.NAME],
        workers: value[FORM_FIELD.WORKERS],
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('新增職位成功')
      // refresh with new data
      router.refresh();
      onSuccess?.(response.data);
    },
  })

  return (
    <ScrollArea className={cn('h-full', className)}>
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
            <CardTitle>新增職位</CardTitle>
            <CardDescription>請輸入職位的資料</CardDescription>
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
              <form.AppField name={FORM_FIELD.WORKERS}>
                {(field) => (
                  <field.MultipleComboboxField
                    label="職員"
                    options={workers}
                    getOptionValue={(w) => w.id}
                    getOptionDisplay={(w) => w.name}
                    placeholder="請選擇職員"
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
    </ScrollArea>
  )
}