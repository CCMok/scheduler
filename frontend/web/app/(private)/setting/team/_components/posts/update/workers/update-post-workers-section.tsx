'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { FORM_FIELD, FORM_ID, formSchema } from "./update-post-workers-form-utils"
import { revalidateLogic } from "@tanstack/react-form";
import { Field } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { Worker } from "@/external/prisma/generated/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PostWorker } from "@/libs/post/post";
import { updatePostWorkersAction } from "@/libs/post/update/workers/update-post-workers-action";
import RankedWorkerList from "./ranked-worker-list";

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
  const workerById = new Map(workers.map((w) => [w.id, w]));

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
      toast.success('更改職位的職員優先順序成功')
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
          <CardTitle>職員優先順序</CardTitle>
          <CardDescription>
            可擔任此職位的職員。越上方越優先被自動編排（類似值班偏好排序，無需輸入數字）。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppField name={FORM_FIELD.WORKERS}>
            {(field) => {
              const orderedWorkers = field.state.value
                .map((id) => workerById.get(id) ?? post.workers.find((w) => w.id === id))
                .filter((w): w is Worker => w != null);

              return (
                <RankedWorkerList
                  orderedWorkers={orderedWorkers}
                  pool={workers}
                  onChange={(next) => field.handleChange(next.map((w) => w.id))}
                />
              );
            }}
          </form.AppField>
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
