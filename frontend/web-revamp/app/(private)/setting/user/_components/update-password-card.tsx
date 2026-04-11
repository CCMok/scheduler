'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import { FORM_FIELD, FORM_ID, formSchema } from "./update-password-form-utils"
import { useAppForm } from "@/components/_general/form/utils/form-utils"
import { revalidateLogic } from "@tanstack/react-form"
import { Field, FieldGroup } from "@/external/shadcn/components/ui/field"
import PasswordRequirement from "@/components/auth/password-requirement"
import { Check } from "lucide-react"
import { updatePasswordAction } from "@/libs/auth/update-password/update-password-action"
import { toast } from "sonner"

export default function UpdatePasswordCard() {
  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.CURRENT_PASSWORD]: '',
      [FORM_FIELD.NEW_PASSWORD]: '',
      [FORM_FIELD.CONFIRM_PASSWORD]: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const response = await updatePasswordAction({
        currentPassword: value[FORM_FIELD.CURRENT_PASSWORD],
        newPassword: value[FORM_FIELD.NEW_PASSWORD],
      })
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('更改密碼成功')
      formApi.reset();
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
          <CardTitle className='text-xl'>更改密碼</CardTitle>
          <CardDescription>請輸入您的新密碼</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className='lg:w-(--input-width)'>
            <form.AppField name={FORM_FIELD.CURRENT_PASSWORD}>
              {(field) => (
                <field.TextField
                  label="舊密碼"
                  autoComplete="current-password"
                  type='password'
                />
              )}
            </form.AppField>
            <form.AppField name={FORM_FIELD.NEW_PASSWORD}>
              {(field) => (
                <div className='space-y-2'>
                  <field.TextField
                    label="新密碼"
                    autoComplete="new-password"
                    type='password'
                    showError={false}
                  />
                  <PasswordRequirement value={field.state.value} />
                </div>
              )}
            </form.AppField>
            <form.AppField name={FORM_FIELD.CONFIRM_PASSWORD}>
              {(field) => (
                <field.TextField
                  label="確認密碼"
                  autoComplete="new-password"
                  type='password'
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