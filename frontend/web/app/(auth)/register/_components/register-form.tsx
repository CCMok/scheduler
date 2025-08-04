'use client'

import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/form/custom-form-item';
import FormRootMessage from '@/components/form/form-root-message';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/form/form-submit-button';
import CustomInput from '@/components/input/custom-input';
import useServerResponseHandler from '@/libs/client/_general/hooks/server-response-handler-hook';
import { ServerResponse } from '@/libs/share/_general/models/server-response';
import { ClientMessage } from '@/libs/client/_general/models/client-message';
import { RegisterFormInput, registerFormInputSchema } from '@/libs/client/register/models/register-form-input';
import { registerAction } from '@/libs/server/register/actions/register-action';
import { toast } from "sonner";
import { ClientMessageTitle } from '@/libs/client/_general/enums/client-message-enum';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { RegisterRequest } from '@/libs/server/register/models/register-request';
import NewPasswordFormField from '../../../../components/form/new-password-form-field';
import { REDIRECT_PRIVATE_PATH } from '@/libs/share/_general/utils/path';

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

  const { handleServerResponse } = useServerResponseHandler();

  const onSubmit = async (input: RegisterFormInput) => {
    const request: RegisterRequest = {
      email: input.email,
      password: input.password,
      name: input.name,
    }

    const response = await registerAction(request)
    await handleServerResponse(response, onSuccess, onError);
  }

  const onSuccess = () => {
    toast.success('註冊' + ClientMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '編排您第一個值班表吧！',
    })

    router.push(REDIRECT_PRIVATE_PATH)
  }

  const onError = (_: ServerResponse, clientMessage: ClientMessage) => {
    form.setError('root', { type: clientMessage.title, message: clientMessage.content })
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