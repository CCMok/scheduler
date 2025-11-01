'use client';

import { ServiceResponse } from '@/libs/share/_general/models/service-response';
import ServiceHandleDialog from './old-service-handle-dialog';

type Props<R = object> = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  entityName?: string;
  displayName?: string;
  submit?: () => Promise<ServiceResponse<R>>;
  onSuccess?: (data: R) => (void | Promise<void>);
};

export default function DeleteDialog<R = object>({
  isOpen,
  setIsOpen,
  entityName = '',
  displayName = '',
  submit,
  onSuccess,
}: Readonly<Props<R>>) {
  return (
    <ServiceHandleDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`刪除${entityName}`}
      description={`確定要刪除${displayName}嗎？`}
      submit={submit}
      onSuccess={onSuccess}
    />
  )
}