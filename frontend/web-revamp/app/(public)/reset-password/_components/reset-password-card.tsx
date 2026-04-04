'use client'

import { Field, FieldGroup } from "@/external/shadcn/components/ui/field";
import { revalidateLogic } from "@tanstack/react-form";
import { useAppForm } from "@/components/_general/form/utils/form-utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { Mail } from "lucide-react";
import { FORM_FIELD, FORM_ID, formSchema } from "./reset-password-form-utils";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/libs/auth/reset-password/reset-password-action";
import { toast } from "sonner";
import { ROUTE } from "@/libs/_general/route/route-config";

export default function ResetPasswordCard({
  className,
}: Readonly<{
  className?: string;
}>) {
  const router = useRouter()

  const form = useAppForm({
    defaultValues: {
      [FORM_FIELD.EMAIL]: '',
    },
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: formSchema,
    },
    onSubmit: async ({ value }) => {
      const response = await resetPasswordAction(value)
      if (!response.isSuccess) {
        toast.error(response.message)
        return;
      }
      router.push(ROUTE.public.resetPassword.verifyEmail.sent);
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
          <CardDescription>輸入您的電郵地址，我們將發送一封密碼重設的電郵到您的郵箱。</CardDescription>
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
          </FieldGroup>
        </CardContent>
        <CardFooter className='flex-col space-y-2'>
          <form.AppForm>
            <Field>
              <form.SubmitButton icon={<Mail />}>
                發送
              </form.SubmitButton>
            </Field>
          </form.AppForm>
        </CardFooter>
      </Card>
    </form>
  )
}