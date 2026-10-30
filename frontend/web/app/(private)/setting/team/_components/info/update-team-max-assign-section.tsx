'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import {
  FORM_FIELD,
  FORM_ID,
  formSchema,
  formValueToMaxAssign,
  maxAssignToFormValue,
} from "./update-team-max-assign-form-utils";
import { revalidateLogic } from "@tanstack/react-form";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";
import { Team } from "@/external/prisma/generated/client";
import { updateTeamMaxAssignAction } from "@/libs/team/update/max-assign/update-team-max-assign-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdateTeamMaxAssignSection({
  team,
}: Readonly<{
  team: Team;
}>) {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.MAX_ASSIGN]: maxAssignToFormValue(team.maxWorkerAssignPerRoster),
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await updateTeamMaxAssignAction({
        id: team.id,
        maxWorkerAssignPerRoster: formValueToMaxAssign(value[FORM_FIELD.MAX_ASSIGN]),
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('更改每表上限成功')
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
    >
      <Card>
        <CardHeader>
          <CardTitle>每表上班上限</CardTitle>
          <CardDescription>
            每位職員在同一份值班表內最多可被安排幾次。留空表示不設上限。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='lg:w-(--input-width)'>
            <form.AppField name={FORM_FIELD.MAX_ASSIGN}>
              {(field) => (
                <field.TextField
                  label="上限次數"
                  type="number"
                  placeholder="不設上限"
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
