'use client'

import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { FORM_FIELD, formSchema } from "./update-team-name-form-utils";
import { revalidateLogic } from "@tanstack/react-form";
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { Check } from "lucide-react";

// TODO
const userName = 'dummy'

export default function TeamInfoSettingSection() {
  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.NAME]: userName ?? '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      // TODO
      // const response = await updateUserNameAction({
      //   name: value[FORM_FIELD.NAME],
      // })
      // if (!response.isSuccess) {
      //   toast.error(response.message)
      //   return;
      // }
      // toast.success('更改名稱成功')
      // // refresh with new session
      // router.refresh();
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>更改名稱</CardTitle>
        <CardDescription>請輸入團隊的新名稱</CardDescription>
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
  )
}