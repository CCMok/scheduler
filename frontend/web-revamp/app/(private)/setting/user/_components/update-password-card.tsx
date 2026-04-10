'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/external/shadcn/components/ui/card"
import { FORM_ID } from "./update-password-form-utils"

export default function UpdatePasswordCard() {
  return (
    <form
      id={FORM_ID}
    // onSubmit={(e) => {
    //   e.preventDefault();
    //   form.handleSubmit();
    // }}
    >
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>更改密碼</CardTitle>
          <CardDescription>請輸入您的新密碼</CardDescription>
        </CardHeader>
        <CardContent>
          {/* <FieldGroup>
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
                  labelAddOn={
                    <CustomButton asChild variant='link' className='h-fit p-0'>
                      <CustomLink href={ROUTE.public.resetPassword.base}>
                        忘記密碼
                      </CustomLink>
                    </CustomButton>
                  }
                  autoComplete="current-password"
                  type='password'
                />
              )}
            </form.AppField>
          </FieldGroup> */}
        </CardContent>
        {/* <CardFooter className='flex-col space-y-2'>
          <form.AppForm>
            <Field>
              <form.SubmitButton icon={<LogIn />}>
                登入
              </form.SubmitButton>
            </Field>
          </form.AppForm>
          <p>
            <span className='text-sm text-muted-foreground font-medium'>
              沒有帳號?
            </span>
            <CustomButton asChild variant='link' size='sm'>
              <CustomLink href={ROUTE.public.signUp.base}>
                立即註冊
              </CustomLink>
            </CustomButton>
          </p>
        </CardFooter> */}
      </Card>
    </form>
  )
}