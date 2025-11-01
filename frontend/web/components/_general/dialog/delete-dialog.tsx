'use client';

import { ServiceResponse } from "@/libs/server/_general/models/service-response";
import CudServiceHandleDialog from "./cud-service-handle-dialog";
import { toast } from "sonner";
import { MessageTitle } from "@/libs/server/_general/enums/message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";

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
  const onSuccessFinal = async (data: R) => {
    toast.success(`刪除${entityName}` + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })
    await onSuccess?.(data);
  }

  return (
    <CudServiceHandleDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={`刪除${entityName}`}
      description={`確定要刪除${displayName}嗎？`}
      submit={submit}
      onSuccess={onSuccessFinal}
    />
  )
}