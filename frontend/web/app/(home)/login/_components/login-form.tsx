'use client'

import { LoginFormInput, loginFormInputSchema } from '@/app/(home)/login/_components/login-form-input';
import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { loginAction } from '@/libs/access/actions/login-action';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/_general/form/form-submit-button';
import CustomInput from '@/components/_general/input/custom-input';
import { REDIRECT_PRIVATE_PATH } from '@/libs/_general/enums/path';
import { CLEANABLE_LOCAL_STORAGE_KEYS } from '@/libs/_general/enums/local-storage-key';
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';

const inputClassName = 'w-full'

export default function LoginForm() {
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
    
    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    // Remove user specific item
    for (const key of CLEANABLE_LOCAL_STORAGE_KEYS) {
      localStorage.removeItem(key)
    }

    router.push(REDIRECT_PRIVATE_PATH)
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
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
      </form>
    </Form >
  )
}