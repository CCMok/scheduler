'use client';

import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { UiMessageTitle } from '@/libs/share/_general/enums/ui-message';
import { useRouter } from 'next/navigation';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import { useState } from 'react';

type Props<R = object> = {
  title?: string;
  description?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  submit?: () => Promise<ServiceResponse<R>>;
  onSuccess?: (data: R) => (void | Promise<void>);
};

export default function ServiceHandleDialog<R = object>({
  title = '',
  description = '',
  isOpen,
  setIsOpen,
  submit,
  onSuccess,
}: Readonly<Props<R>>) {
  const router = useRouter();

  const [isOpenDefault, setIsOpenDefault] = useState(false)
  const isOpenFinal = isOpen ?? isOpenDefault
  const setIsOpenFinal = setIsOpen ?? setIsOpenDefault

  const onContinue = async () => {
    if (!submit) return

    const response = await submit();
    const uiResponse = handleServiceResponse(response, path => router.push(path));
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success(title + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    await onSuccess?.(uiResponse.data);
    router.refresh();
    setIsOpenFinal(false)
  }

  return (
    <ConfirmDialog
      isOpen={isOpenFinal}
      setIsOpen={setIsOpenFinal}
      title={title}
      description={description}
      onContinue={onContinue}
    />
  )
}