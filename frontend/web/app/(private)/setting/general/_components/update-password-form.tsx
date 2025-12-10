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
import { Save } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/_general/constants/sonnar-constant';
import { UpdatePasswordRequest } from '@/libs/user/models/update-password-request';
import { updatePasswordAction } from '@/libs/user/actions/update-password-action';
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';
import { MessageTitle } from '@/libs/_general/enums/message';
import CustomCard from '@/components/_general/card/custom-card';

export default function UpdatePasswordForm() {
  const form = useForm({
    resolver: zodResolver(updatePasswordFormInputSchema),
    defaultValues: {
      [UpdatePasswordFormInputKey.PASSWORD]: '',
      [UpdatePasswordFormInputKey.CONFIRM_PASSWORD]: '',
    },
  })

  const router = useRouter()

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const onSubmit = async () => {
    setIsAlertDialogOpen(true)
  }

  const onAlertDialogContinue = async () => {
    const input = form.getValues()
    const request: UpdatePasswordRequest = {
      password: input[UpdatePasswordFormInputKey.PASSWORD],
    }

    const response = await updatePasswordAction(request)

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success(`更改密碼` + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh()
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CustomCard
          title='密碼'
          description='更改您的密碼。'
          footer={(
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          )}
          contentClassName='flex flex-wrap'
        >
          <NewPasswordFormField<UpdatePasswordFormInput>
            name={UpdatePasswordFormInputKey.PASSWORD}
            inputProps={{ placeholder: '新密碼' }}
          />
          <FormField
            control={form.control}
            name={UpdatePasswordFormInputKey.CONFIRM_PASSWORD}
            render={({ field }) => (
              <CustomFormItem>
                <FormControl>
                  <CustomInput
                    type='password'
                    autoComplete='new-password'
                    placeholder='確認密碼'
                    {...field}
                  />
                </FormControl>
              </CustomFormItem>
            )}
          />
        </CustomCard>
        <ConfirmDialog
          isOpen={isAlertDialogOpen}
          setIsOpen={setIsAlertDialogOpen}
          title='確定要儲存嗎?'
          description='儲存後將更改密碼，請確認是否繼續。'
          onConfirm={onAlertDialogContinue}
        />
      </form>
    </Form >
  )
}