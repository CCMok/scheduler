'use client'

import CustomButton from "@/components/_general/button/custom-button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card";
import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field";
import { revalidateLogic } from "@tanstack/react-form";
import { FORM_FIELD, FORM_ID, formSchema } from "./login-form-const";
import { useAppForm } from "@/components/_general/form/utils/form-utils";

export default function LoginCard() {
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
      console.log(value);
    },
  })

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className='text-center'>
        <CardTitle className='text-xl'>登入</CardTitle>
        <CardDescription>輸入您的登入資訊</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id={FORM_ID}
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <FieldSet>
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
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <CustomButton
          type='submit'
          className='w-full'
          form={FORM_ID}
        >
          登入
        </CustomButton>
      </CardFooter>
    </Card>
  )
}