'use client'

import { LoginFormInput, loginFormInputSchema } from '@/libs/client/login/models/login-form-input';
import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';
import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { cn } from '@/external/shadcn/libs/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormItemCustom from '@/components/form/form-item-custom';
import FormRootMessage from '@/components/form/form-root-message';
import { loginAction } from '@/libs/server/login/action/login-action';
import { getRootMessage } from '@/libs/client/_general/utils/form-utils';
import { ServerResponseStatus } from '@/libs/server/_general/enums/server-response-status';
import { useRouter } from 'next/navigation';
import { Path } from '@/libs/share/_general/enums/path';
import FormSubmitButton from '@/components/form/form-submit-button';
import InputCustom from '@/components/input/input-custom';

const inputClassName = 'w-full'

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

  const onSubmit = async (input: LoginFormInput) => {
    const response = await loginAction(input)

    if (response.status !== ServerResponseStatus.OK) {
      const rootMessage = getRootMessage(response)
      form.setError('root', { type: rootMessage.title, message: rootMessage.content })
      return
    }

    router.push(Path.DASHBOARD)
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
            <FormItemCustom label='電郵地址'>
              <FormControl>
                <InputCustom
                  type='email'
                  autoComplete='email'
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
            </FormItemCustom>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItemCustom label='密碼'>
              <FormControl>
                <InputCustom
                  type='password'
                  autoComplete='current-password'
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
            </FormItemCustom>
          )}
        />

        <FormSubmitButton className={inputClassName}>登入</FormSubmitButton>

        <FormRootMessage />
      </form>
    </Form >
  )
}