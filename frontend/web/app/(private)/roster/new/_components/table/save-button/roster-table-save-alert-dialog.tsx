'use client';

import { Save } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from '@/components/_general/button/custom-button';
import RosterTableSaveConfirmDescription from "./roster-table-save-confirm-description";
import RosterTableSaveConfirmButton from "./roster-table-save-confirm-button";
import { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { getMaxHistoryCountAction } from "@/libs/organization/actions/get-max-history-count-action";
import { MaxHistoryCountStoreProvider, useMaxHistoryCountStore } from "./store/max-history-count-store-provider";
import { useCreateRosterStore } from "../../store/create-roster-store-provider";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

function RosterTableSaveAlertDialog() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const router = useRouter();

  const generatedScheduleDepartmentId = useCreateRosterStore(state => state.generatedScheduleDepartmentId);

  const isFetchingMaxHistoryCount = useMaxHistoryCountStore(state => state.isFetchingMaxHistoryCount);
  const setMaxHistoryCount = useMaxHistoryCountStore(state => state.setMaxHistoryCount);
  const setIsFetchingMaxHistoryCount = useMaxHistoryCountStore(state => state.setIsFetchingMaxHistoryCount);

  const fetchMaxHistoryCount = useCallback(async (): Promise<void> => {
    if (isNil(generatedScheduleDepartmentId)) return;

    const response = await getMaxHistoryCountAction(generatedScheduleDepartmentId)
    const data = handleGetResponse(response, router.push, undefined)

    setMaxHistoryCount(data)
  }, [generatedScheduleDepartmentId, router, setMaxHistoryCount])

  const onDialogOpen = useCallback(async (): Promise<void> => {
    if (isFetchingMaxHistoryCount) return;

    setIsFetchingMaxHistoryCount(true);
    await fetchMaxHistoryCount();
    setIsFetchingMaxHistoryCount(false);
  }, [isFetchingMaxHistoryCount, setIsFetchingMaxHistoryCount, fetchMaxHistoryCount])

  const previousDepartmentId = useRef<boolean>(false);

  useEffect(() => {
    if (!isAlertDialogOpen) {
      previousDepartmentId.current = false;
      return;
    }

    if (!previousDepartmentId.current) {
      onDialogOpen();
    }

    previousDepartmentId.current = true;
  }, [isAlertDialogOpen, onDialogOpen]);

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <CustomButton>
          <Save />
          儲存
        </CustomButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>確定要儲存值班表嗎?</AlertDialogTitle>
          <AlertDialogDescription>
            <RosterTableSaveConfirmDescription />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <RosterTableSaveConfirmButton setIsAlertDialogOpen={setIsAlertDialogOpen} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function RosterTableSaveButton() {
  return (
    <MaxHistoryCountStoreProvider>
      <RosterTableSaveAlertDialog />
    </MaxHistoryCountStoreProvider>
  )
}