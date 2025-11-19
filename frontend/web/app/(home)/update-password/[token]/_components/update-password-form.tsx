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
import { updatePasswordAction } from '@/libs/user/actions/update-password-action';
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';
import { toast } from 'sonner';
import { MessageTitle } from '@/libs/_general/enums/message';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/_general/constants/sonnar-constant';
import { afterLoginUi } from '@/libs/access/utils/login-utils';
import LabelInput from '@/components/_general/input/label-input';
import { REDIRECT_PRIVATE_PATH } from '@/libs/_general/enums/path';

const INPUT_CLASS_NAME = 'w-full'
const INPUT_ID_EMAIL = 'email'

type Props = {
  token: string;
  email: string;
}

export default function UpdatePasswordForm({
  token,
  email,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updatePasswordFormInputSchema),
    defaultValues: {
      [UpdatePasswordFormInputKey.PASSWORD]: '',
      [UpdatePasswordFormInputKey.CONFIRM_PASSWORD]: '',
    },
  })

  const router = useRouter()

  const onSubmit = async (input: UpdatePasswordFormInput) => {
    const response = await updatePasswordAction({
      password: input[UpdatePasswordFormInputKey.PASSWORD],
      token,
    })

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('更改密碼' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    afterLoginUi()

    router.push(REDIRECT_PRIVATE_PATH)
  }

  return (
    <Form {...form}>
      <form
        className='space-y-4'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <LabelInput
          label='電郵地址'
          htmlFor={INPUT_ID_EMAIL}
        >
          <CustomInput
            id={INPUT_ID_EMAIL}
            type='email'
            autoComplete='email'
            value={email}
            disabled
            className={INPUT_CLASS_NAME}
          />
        </LabelInput>
        <NewPasswordFormField<UpdatePasswordFormInput>
          name={UpdatePasswordFormInputKey.PASSWORD}
          formItemProps={{ label: '新密碼' }}
          className={INPUT_CLASS_NAME}
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
                  className={INPUT_CLASS_NAME}
                  {...field}
                />
              </FormControl>
            </CustomFormItem>
          )}
        />
        <FormSubmitButton className={INPUT_CLASS_NAME}>確定</FormSubmitButton>
      </form>
    </Form >
  )
}