'use client'

import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/_general/form/form-submit-button';
import CustomInput from '@/components/_general/input/custom-input';
import { ResetPasswordFormInput, ResetPasswordFormInputKey, resetPasswordFormInputSchema } from './reset-password-form-input';
import { resetPasswordAction } from '@/libs/access/actions/reset-password-action';
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';
import { REDIRECT_PUBLIC_PATH } from '@/libs/_general/enums/path';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/_general/constants/sonnar-constant';

const inputClassName = 'w-full'

export default function ResetPasswordForm() {
  const form = useForm({
    resolver: zodResolver(resetPasswordFormInputSchema),
    defaultValues: {
      [ResetPasswordFormInputKey.EMAIL]: '',
    },
  })

  const router = useRouter()

  const onSubmit = async (input: ResetPasswordFormInput) => {
    const response = await resetPasswordAction(input)

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('已發送密碼重設電郵，請檢查您的電郵。', {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.push(REDIRECT_PUBLIC_PATH)
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name={ResetPasswordFormInputKey.EMAIL}
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

        <FormSubmitButton className={inputClassName}>發送密碼重設電郵</FormSubmitButton>
      </form>
    </Form >
  )
}