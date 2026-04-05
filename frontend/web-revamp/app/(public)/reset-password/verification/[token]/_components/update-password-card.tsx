'use client'

import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Check } from "lucide-react";
import MandatoryLabel from "@/components/_general/form/label/mandatory-label";
import { FORM_FIELD, FORM_ID, formSchema } from "./update-password-form-utils";
import { UserOmitPassword } from "@/libs/user/user";
import PasswordRequirement from "@/components/auth/password-requirement";

export default function UpdatePasswordCard({
  className,
  user,
  token,
}: Readonly<{
  className?: string;
  user: UserOmitPassword;
  token: string;
}>) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.EMAIL]: user.email,
      [FORM_FIELD.PASSWORD]: '',
      [FORM_FIELD.CONFIRM_PASSWORD]: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      // const response = await signUpAction(value)
      // if (!response.isSuccess) {
      //   toast.error(response.message)
      //   return;
      // }
      // router.push(ROUTE.public.signUp.verification.sent);
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
        <CardHeader className='text-center'>
          <CardTitle className='text-xl'>密碼重設</CardTitle>
          <CardDescription>電郵驗證成功，請輸入您的新密碼</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form.AppField name={FORM_FIELD.EMAIL}>
              {(field) => (
                <field.TextField
                  label={<MandatoryLabel>電郵</MandatoryLabel>}
                  placeholder="m@example.com"
                  autoComplete="email"
                  type='email'
                  disabled
                />
              )}
            </form.AppField>
            <form.AppField name={FORM_FIELD.PASSWORD}>
              {(field) => (
                <div className='space-y-2'>
                  <field.TextField
                    label={<MandatoryLabel>密碼</MandatoryLabel>}
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
                  label={<MandatoryLabel>確認密碼</MandatoryLabel>}
                  autoComplete="new-password"
                  type='password'
                />
              )}
            </form.AppField>
          </FieldGroup>
        </CardContent>
        <CardFooter className='flex-col space-y-2'>
          <form.AppForm>
            <Field>
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