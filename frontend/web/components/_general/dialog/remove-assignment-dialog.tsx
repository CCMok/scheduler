'use client';

import { ServiceResponse } from '@/libs/_general/models/service-response';
import ServiceHandleDialog from './cud-service-handle-dialog';
import { toast } from 'sonner';
import { MessageTitle } from '@/libs/_general/enums/message';
import { SONNER_DEFAULT_OPTIONS } from '@/libs/_general/constants/sonnar-constant';

type Props<R = object> = {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  submit?: () => Promise<ServiceResponse<R>>;
  onSuccess?: (data: R) => (void | Promise<void>);
  displayName?: string;
  assigneeEntityName?: string;
};

export default function RemoveAssignmentDialog<R = object>({
  isOpen,
  setIsOpen,
  submit,
  onSuccess,
  displayName = '',
  assigneeEntityName = '',
}: Readonly<Props<R>>) {
  const onSuccessFinal = async (data: R) => {
    toast.success(`刪除指派${assigneeEntityName}` + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })
    await onSuccess?.(data);
  }

  return (
    <ServiceHandleDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`刪除指派${assigneeEntityName}`}
      description={`確定要刪除指派${displayName}嗎？`}
      submit={submit}
      onSuccess={onSuccessFinal}
    />
  )
}