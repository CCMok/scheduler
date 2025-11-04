'use client'

import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import FormRootMessage from '@/components/_general/form/form-root-message';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/_general/form/form-submit-button';
import CustomInput from '@/components/_general/input/custom-input';
import { UpdatePasswordFormInput, updatePasswordFormInputSchema } from '@/app/(private)/setting/general/_components/update-pasword-form-input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card';
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

export default function UpdatePasswordForm() {
  const form = useForm({
    resolver: zodResolver(updatePasswordFormInputSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
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
      password: input.password,
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
        <Card>
          <CardHeader>
            <CardTitle>密碼</CardTitle>
            <CardDescription>
              更改你在Scheduler的密碼。
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap space-x-4 space-y-4'>
            <NewPasswordFormField<UpdatePasswordFormInput>
              name='password'
              inputProps={{ placeholder: '新密碼' }}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
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
          </CardContent>
          <CardFooter className='flex space-x-4'>
            <FormRootMessage />
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          </CardFooter>
        </Card>
        <ConfirmDialog
          isOpen={isAlertDialogOpen}
          setIsOpen={setIsAlertDialogOpen}
          title='確定要儲存嗎?'
          description='儲存後將更改密碼，請確認是否繼續。'
          onContinue={onAlertDialogContinue}
        />
      </form>
    </Form >
  )
}