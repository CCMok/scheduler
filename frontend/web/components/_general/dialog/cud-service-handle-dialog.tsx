'use client';

import ConfirmDialog from '@/components/_general/dialog/confirm-dialog';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ServiceResponse } from '@/libs/_general/models/service-response';
import { handleCudResponse } from '@/libs/_general/utils/response-utils';
import { isNil } from 'lodash';

type Props<R = object> = {
  title?: string;
  description?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  submit?: () => Promise<ServiceResponse<R>>;
  onSuccess?: (data: R) => (void | Promise<void>);
};

export default function CudServiceHandleDialog<R = object>({
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
    
    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    await onSuccess?.(data)

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