'use client'

import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import FormRootMessage from '@/components/_general/form/form-root-message';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/_general/form/form-submit-button';
import CustomInput from '@/components/_general/input/custom-input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/external/shadcn/components/ui/card';
import { Save } from 'lucide-react';
import { useState } from 'react';
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { toast } from 'sonner';
import { UiMessageContent, UiMessageTitle } from '@/libs/share/_general/enums/ui-message';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { UpdateUserNameFormInput, updateUserNameFormInputSchema } from '@/libs/client/user/models/update-user-name-form-input';
import { UpdateUserNameRequest } from '@/libs/server/user/models/update-user-name-request';
import { updateUserNameAction } from '@/libs/server/user/actions/update-user-name-action';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';

type Props = {
  userName: string;
}

export default function UpdateUserNameForm({
  userName,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(updateUserNameFormInputSchema),
    defaultValues: {
      name: userName,
    },
  })

  const router = useRouter()

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const onSubmit = async (input: UpdateUserNameFormInput) => {
    const isValidInput = inputCheck(input)
    if (!isValidInput) return;

    setIsAlertDialogOpen(true)
  }

  const inputCheck = (input: UpdateUserNameFormInput): boolean => {
    const isSameName = input.name !== userName;
    if (!isSameName) {
      form.setError('root', {
        type: UiMessageTitle.INPUT_ERROR,
        message: UiMessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱')
      });

      return false;
    }

    return true;
  }

  const onAlertDialogContinue = async () => {
    const input = form.getValues()
    const request: UpdateUserNameRequest = {
      name: input.name,
    }

    const response = await updateUserNameAction(request)
    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      form.setError('root', { type: uiResponse.message.title, message: uiResponse.message.content })
      return
    }

    toast.success(UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已更改用戶名稱',
    })

    router.refresh()
    form.reset({
      name: input.name,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>用戶名稱</CardTitle>
            <CardDescription>
              更改你在Scheduler的用戶名稱。
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-wrap space-x-4 space-y-4'>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <CustomFormItem>
                  <FormControl>
                    <CustomInput
                      autoComplete='nickname'
                      placeholder={'用戶名稱'}
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
          description='儲存後將更改用戶名稱，請確認是否繼續。'
          onContinue={onAlertDialogContinue}
        />
      </form>
    </Form >
  )
}