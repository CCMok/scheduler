'use client'

import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { revalidateLogic } from "@tanstack/react-form";
import { FORM_FIELD, FORM_ID, formSchema } from "./sign-up-form-utils";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { UserPen } from "lucide-react";
import CustomLink from "@/components/_general/_custom/link/custom-link";
import CustomButton from "@/components/_general/_custom/button/custom-button";
import MandatoryLabel from "@/components/_general/form/label/mandatory-label";
import { signUpAction } from "@/libs/auth/sign-up/sign-up-action";
import { toast } from "sonner";
import { ROUTE } from "@/libs/_general/route/route-config";
import PasswordRequirement from "./password-requirement";

export default function SignUpCard({
  className,
}: Readonly<{
  className?: string;
}>) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.EMAIL]: '',
      [FORM_FIELD.PASSWORD]: '',
      [FORM_FIELD.CONFIRM_PASSWORD]: '',
      [FORM_FIELD.NAME]: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await signUpAction(value)
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      router.push(ROUTE.public.signUp.verifyEmail.sent);
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
          <CardTitle className='text-xl'>註冊</CardTitle>
          <CardDescription>輸入您的帳號資訊</CardDescription>
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
        <CardFooter className='flex-col space-y-2'>
          <form.AppForm>
            <Field>
              <form.SubmitButton icon={<UserPen />}>
                註冊
              </form.SubmitButton>
            </Field>
          </form.AppForm>
          <p>
            <span className='text-sm text-muted-foreground font-medium'>
              已有帳號?
            </span>
            <CustomButton asChild variant='link' size='sm'>
              <CustomLink href={ROUTE.public.login}>
                返回登入
              </CustomLink>
            </CustomButton>
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}