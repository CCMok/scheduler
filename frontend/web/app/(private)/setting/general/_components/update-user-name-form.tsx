'use client'

import { Form, FormControl, FormField } from '@/external/shadcn/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomFormItem from '@/components/_general/form/custom-form-item';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/_general/form/form-submit-button';
import CustomInput from '@/components/_general/input/custom-input';
import { Save } from 'lucide-react';
import { use, useState } from 'react';
import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/_general/constants/sonnar-constant';
import { UpdateUserNameFormInput, updateUserNameFormInputSchema, UpdateUserNameFormKey } from '@/app/(private)/setting/general/_components/update-user-name-form-input';
import { UpdateUserNameRequest } from '@/libs/user/models/update-user-name-request';
import { updateUserNameAction } from '@/libs/user/actions/update-user-name-action';
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';
import { MessageContent, MessageTitle } from '@/libs/_general/enums/message';
import { SessionPayload } from '@/libs/access/models/session-payload';
import CustomCard from '@/components/_general/card/custom-card';

type Props = {
  sessionPromise: Promise<SessionPayload | undefined>;
}

export default function UpdateUserNameForm({
  sessionPromise,
}: Readonly<Props>) {
  const session = use(sessionPromise)
  const userName = session?.name ?? '';

  const form = useForm({
    resolver: zodResolver(updateUserNameFormInputSchema),
    defaultValues: {
      [UpdateUserNameFormKey.NAME]: userName,
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
    const isSameName = input[UpdateUserNameFormKey.NAME] !== userName;
    if (!isSameName) {
      form.setError(UpdateUserNameFormKey.NAME, {
        type: MessageTitle.INPUT_ERROR,
        message: MessageContent.NOT_MATCH.replaceAll('{0}', '原本名稱')
      });

      return false;
    }

    return true;
  }

  const onAlertDialogContinue = async () => {
    const input = form.getValues()
    const request: UpdateUserNameRequest = {
      name: input[UpdateUserNameFormKey.NAME],
    }

    const response = await updateUserNameAction(request)

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success(`更改用戶名稱` + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh()
    form.reset({
      [UpdateUserNameFormKey.NAME]: input[UpdateUserNameFormKey.NAME],
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CustomCard
          title='用戶名稱'
          description='更改您的用戶名稱。'
          footer={(
            <FormSubmitButton
              icon={<Save />}
              className='ml-auto'
            >
              儲存
            </FormSubmitButton>
          )}
        >
          <FormField
            control={form.control}
            name={UpdateUserNameFormKey.NAME}
            render={({ field }) => (
              <CustomFormItem>
                <FormControl>
                  <CustomInput
                    autoComplete='nickname'
                    placeholder='用戶名稱'
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
          description='儲存後將更改用戶名稱，請確認是否繼續。'
          onConfirm={onAlertDialogContinue}
        />
      </form>
    </Form >
  )
}