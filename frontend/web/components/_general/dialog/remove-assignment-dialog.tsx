'use client';

import { ServiceResponse } from '@/libs/_general/models/service-response';
import ServiceHandleDialog from './cud-service-handle-dialog';

type Props<R = object> = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  submit?: () => Promise<ServiceResponse<R>>;
  onSuccess?: (data: R) => (void | Promise<void>);
  displayName?: string;
};

export default function RemoveAssignmentDialog<R = object>({
  isOpen,
  setIsOpen,
  submit,
  onSuccess,
  displayName = '',
}: Readonly<Props<R>>) {
  return (
    <ServiceHandleDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title='刪除指派'
      description={`確定要刪除${displayName}嗎？`}
      submit={submit}
      onSuccess={onSuccess}
    />
  )
}