'use client'

import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { revalidateLogic } from "@tanstack/react-form";
import { FORM_FIELD, FORM_ID, formSchema } from "./login-form-utils";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { loginAction } from "@/libs/auth/login/login-action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { REDIRECT_PRIVATE_PATH } from "@/libs/_general/path/path";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { LogIn } from "lucide-react";

export default function LoginCard({
  className,
}: Readonly<{
  className?: string;
}>) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.EMAIL]: '',
      [FORM_FIELD.PASSWORD]: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await loginAction(value)
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      toast.success('登入成功')
      router.push(REDIRECT_PRIVATE_PATH);
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
          <CardTitle className='text-xl'>登入</CardTitle>
          <CardDescription>輸入您的登入資訊</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form.AppField name={FORM_FIELD.EMAIL}>
              {(field) => (
                <field.TextField
                  label="電郵"
                  placeholder="m@example.com"
                  autoComplete="email"
                  type='email'
                />
              )}
            </form.AppField>
            <form.AppField name={FORM_FIELD.PASSWORD}>
              {(field) => (
                <field.TextField
                  label="密碼"
                  autoComplete="current-password"
                  type='password'
                />
              )}
            </form.AppField>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <form.AppForm>
            <Field>
              <form.SubmitButton icon={<LogIn />}>
                登入
              </form.SubmitButton>
            </Field>
          </form.AppForm>
        </CardFooter>
      </Card>
    </form>
  )
}