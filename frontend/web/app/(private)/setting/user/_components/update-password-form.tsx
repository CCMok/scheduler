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
import { UpdatePasswordFormInput, updatePasswordFormInputSchema } from '@/libs/client/user/models/update-pasword-form-input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card';
import NewPasswordFormField from '@/components/form/new-password-form-field';
import { Save } from 'lucide-react';
import { useState } from 'react';
import WarningDialog from '@/components/dialog/warning-dialog';
import { toast } from 'sonner';
import { ClientMessageTitle } from '@/libs/client/_general/enums/client-message-enum';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { UpdatePasswordRequest } from '@/libs/server/user/models/update-password-request';
import { updatePasswordAction } from '@/libs/server/user/actions/update-password-action';

export default function UpdatePasswordForm() {
  const form = useForm({
    resolver: zodResolver(updatePasswordFormInputSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const router = useRouter()

  const { handleServerResponse } = useServerResponseHandler();
  
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
    await handleServerResponse(response, onSuccess, onError)
  }

  const onSuccess = () => {
    toast.success(ClientMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已更改密碼',
    })

    router.refresh()
    form.reset();
  }

  const onError = (_: ServerResponse, clientMessage: ClientMessage) => {
    form.setError('root', { type: clientMessage.title, message: clientMessage.content })
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
        <WarningDialog
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