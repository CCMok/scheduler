'use client'

import { cn } from "@/external/shadcn/libs/utils";
import { Post } from "@/external/prisma/generated/client";
import { ScrollArea } from "@/external/shadcn/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { revalidateLogic } from "@tanstack/react-form";
import { FORM_FIELD, FORM_ID, formSchema } from "./create-worker-form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { createWorkerAction } from "@/libs/worker/create/create-worker-action";
import { toast } from "sonner";

export default function CreateWorkerPanel({
  className,
  posts,
  teamId,
  onSuccess,
}: Readonly<{
  className?: string;
  posts: Post[];
  teamId: number;
  onSuccess?: (id: number) => void;
}>) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.NAME]: '',
      [FORM_FIELD.POSTS]: [] as number[],
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await createWorkerAction({
        teamId,
        name: value[FORM_FIELD.NAME],
        posts: value[FORM_FIELD.POSTS],
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('新增職員成功')
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
            <CardTitle>新增職員</CardTitle>
            <CardDescription>請輸入職員的資料</CardDescription>
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
    </ScrollArea>
  )
}