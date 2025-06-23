'use client'

import { LoginFormInput, loginFormInputSchema } from '@/libs/client/login/models/login-form-input';
import { ClassNameProps } from '@/libs/share/_general/props/class-name-props';
import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { cn } from '@/external/shadcn/libs/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/form/custom-form-item';
import FormRootMessage from '@/components/form/form-root-message';
import { loginAction } from '@/libs/server/login/action/login-action';
import { useRouter } from 'next/navigation';
import { Path } from '@/libs/share/_general/enums/path';
import FormSubmitButton from '@/components/form/form-submit-button';
import CustomInput from '@/components/input/custom-input';
import useServerResponseHandler from '@/libs/client/_general/hooks/server-response-handler-hook';
import { ServerResponse } from '@/libs/share/_general/model/server-response';
import { ClientMessage } from '@/libs/client/_general/models/client-message-model';

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

  const { handleServerResponse } = useServerResponseHandler();

  const onSubmit = async (input: LoginFormInput) => {
    const response = await loginAction(input)
    await handleServerResponse(response, onSuccess, onError);
  }

  const onSuccess = () => {
    router.push(Path.DASHBOARD)
  }

  const onError = (_: ServerResponse, clientMessage: ClientMessage) => {
    form.setError('root', { type: clientMessage.title, message: clientMessage.content })
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
            <CustomFormItem label='電郵地址'>
              <FormControl>
                <CustomInput
                  type='email'
                  autoComplete='email'
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
            </CustomFormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <CustomFormItem label='密碼'>
              <FormControl>
                <CustomInput
                  type='password'
                  autoComplete='current-password'
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
            </CustomFormItem>
          )}
        />

        <FormSubmitButton className={inputClassName}>登入</FormSubmitButton>

        <FormRootMessage />
      </form>
    </Form >
  )
}