'use client'

import { LoginFormInput, loginFormInputSchema } from '@/libs/client/login/models/login-form-input';
import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';
import { Button } from '@/external/shadcn/components/ui/button';
import { Form, FormField } from '@/external/shadcn/components/ui/form';
import { Input } from '@/external/shadcn/components/ui/input';
import { cn } from '@/external/shadcn/libs/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormItem from '@/components/form/form-item';
import FormRootMessage from '@/components/form/form-root-message';
import { loginAction } from '@/libs/server/login/action/login-action';

export default function LoginForm({
  className,
}: Readonly<ClassNameProps>) {
  const form = useForm({
    resolver: zodResolver(loginFormInputSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (input: LoginFormInput) => {
    await loginAction(input)
  }

  return (
    <Form {...form}>
      <form
        className={cn('space-y-4', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem label='電郵地址'>
              <Input
                type='email'
                autoComplete='email'
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem label='密碼'>
              <Input
                type='password'
                autoComplete='current-password'
                {...field}
              />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full'
        >
          登入
        </Button>

        <FormRootMessage />
      </form>
    </Form>
  )
}