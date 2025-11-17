'use client'

import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/_general/form/form-submit-button';
import CustomInput from '@/components/_general/input/custom-input';
import { UpdatePasswordFormInput, UpdatePasswordFormInputKey, updatePasswordFormInputSchema } from '@/libs/user/models/update-pasword-form-input';
import NewPasswordFormField from '@/components/_general/form/new-password-form-field';

const inputClassName = 'w-full'

export default function UpdatePasswordForm() {
  const form = useForm({
    resolver: zodResolver(updatePasswordFormInputSchema),
    defaultValues: {
      [UpdatePasswordFormInputKey.PASSWORD]: '',
      [UpdatePasswordFormInputKey.CONFIRM_PASSWORD]: '',
    },
  })

  const router = useRouter()

  const onSubmit = async (input: UpdatePasswordFormInput) => {
    // TODO
    // const response = await resetPasswordAction(input)

    // const data = handleCudResponse(response, router.push)
    // if (isNil(data)) return;

    // toast.success('已發送密碼重設電郵，請檢查您的電郵。', {
    //   ...SONNER_DEFAULT_OPTIONS,
    // })

    // router.push(REDIRECT_PUBLIC_PATH)
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <NewPasswordFormField<UpdatePasswordFormInput>
          name={UpdatePasswordFormInputKey.PASSWORD}
          formItemProps={{ label: '新密碼' }}
          className={inputClassName}
        />
        <FormField
          control={form.control}
          name={UpdatePasswordFormInputKey.CONFIRM_PASSWORD}
          render={({ field }) => (
            <CustomFormItem label='確認密碼'>
              <FormControl>
                <CustomInput
                  type='password'
                  autoComplete='new-password'
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
            </CustomFormItem>
          )}
        />
        <FormSubmitButton className={inputClassName}>確定</FormSubmitButton>
      </form>
    </Form >
  )
}