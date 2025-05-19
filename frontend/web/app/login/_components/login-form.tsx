'use client'

import { LoginFormInput, loginFormInputSchema } from '@/libs/client/login/models/login-form-input';
import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';
import { Form, FormField } from '@/external/shadcn/components/ui/form';
import { Input } from '@/external/shadcn/components/ui/input';
import { cn } from '@/external/shadcn/libs/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormItem from '@/components/form/form-item';
import FormRootMessage from '@/components/form/form-root-message';
import { loginAction } from '@/libs/server/login/action/login-action';
import { getMessageBoxMessage } from '@/libs/client/_general/helpers/message-box-message-helper';
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { useRouter } from 'next/navigation';
import { Path } from '@/libs/share/_general/enums/path';
import LoadingButton from '@/components/button/loading-button';
import { useState } from 'react';

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

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const doSubmit = async (input: LoginFormInput) => {
    const response = await loginAction(input)

    if (response.status !== ServerResponseStatus.OK) {
      const messageBoxMessage = getMessageBoxMessage(response)
      form.setError('root', { type: messageBoxMessage.title, message: messageBoxMessage.content })
      return
    }

    router.push(Path.DASHBOARD)
  }

  const onSubmit = async (input: LoginFormInput) => {
    setLoading(true)
    try {
      await doSubmit(input)
    } finally {
      setLoading(false)
    }
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

        <LoadingButton
          type='submit'
          className='w-full'
          loading={loading}
        >
          登入
        </LoadingButton>

        <FormRootMessage />
      </form>
    </Form>
  )
}