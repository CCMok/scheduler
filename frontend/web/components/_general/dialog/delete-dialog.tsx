'use client';

import WarningDialog from '@/components/_general/dialog/warning-dialog';
import { toast } from 'sonner';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/client/_general/constants/sonnar-constant';
import { UiMessageTitle } from '@/libs/share/_general/enums/ui-message';
import { useRouter } from 'next/navigation';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';
import { ServiceResponse } from '@/libs/share/_general/models/service-response';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  entityName?: string;
  displayName?: string;
  submit?: () => Promise<ServiceResponse>;
};

export default function DeleteDialog({
  isOpen,
  setIsOpen,
  entityName = '',
  displayName = '',
  submit,
}: Readonly<Props>) {
  const router = useRouter();

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

    toast.success(`刪除${entityName}` + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.refresh()
    setIsOpen(false)
  }

  return (
    <WarningDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`刪除${entityName}`}
      description={`確定要刪除 ${displayName} 嗎？`}
      onContinue={onContinue}
    />
  )
}