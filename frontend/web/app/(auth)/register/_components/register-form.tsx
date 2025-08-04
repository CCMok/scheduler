'use client'

import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/form/custom-form-item';
import FormRootMessage from '@/components/form/form-root-message';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/form/form-submit-button';
import CustomInput from '@/components/input/custom-input';
import { RegisterFormInput, registerFormInputSchema } from '@/libs/client/register/models/register-form-input';
import { registerAction } from '@/libs/server/register/actions/register-action';
import { toast } from "sonner";
import { UiMessageTitle } from '@/libs/share/_general/enums/ui-message';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { RegisterRequest } from '@/libs/server/register/models/register-request';
import NewPasswordFormField from '../../../../components/form/new-password-form-field';
import { REDIRECT_PRIVATE_PATH } from '@/libs/share/_general/utils/path';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';

const inputClassName = 'w-full'

export default function RegisterForm() {
  const form = useForm({
    resolver: zodResolver(registerFormInputSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  })

  const router = useRouter()

  const onSubmit = async (input: RegisterFormInput) => {
    const request: RegisterRequest = {
      email: input.email,
      password: input.password,
      name: input.name,
    }

    const response = await registerAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path));
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success('註冊' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '編排您第一個值班表吧！',
    })

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
            <CustomFormItem label='電郵地址' isLabelStar>
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

        <NewPasswordFormField<RegisterFormInput>
          className={inputClassName}
          name='password'
          formItemProps={{ label: '密碼', isLabelStar: true }}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <CustomFormItem label='確認密碼' isLabelStar>
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

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <CustomFormItem label='名稱'>
              <FormControl>
                <CustomInput
                  autoComplete='nickname'
                  className={inputClassName}
                  {...field}
                />
              </FormControl>
            </CustomFormItem>
          )}
        />

        <FormSubmitButton className={inputClassName}>註冊</FormSubmitButton>

        <FormRootMessage />
      </form>
    </Form >
  )
}