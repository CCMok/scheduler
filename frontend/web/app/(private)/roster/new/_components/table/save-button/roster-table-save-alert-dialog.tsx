'use client';

import { Save } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from '@/components/_general/button/custom-button';
import RosterTableSaveConfirmDescription from "./roster-table-save-confirm-description";
import RosterTableSaveConfirmButton from "./roster-table-save-confirm-button";
import { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { GetMaxHistoryCountRequest } from "@/libs/server/organization/models/get-max-history-count-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { getMaxHistoryCountAction } from "@/libs/server/organization/actions/get-max-history-count-action";
import { MaxHistoryCountStoreProvider, useMaxHistoryCountStore } from "./store/max-history-count-store-provider";
import { useCreateRosterStore } from "../../store/create-roster-store-provider";

function RosterTableSaveAlertDialog() {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const router = useRouter();

  const generatedScheduleDepartmentId = useCreateRosterStore(state => state.generatedScheduleDepartmentId);

  const isFetchingMaxHistoryCount = useMaxHistoryCountStore(state => state.isFetchingMaxHistoryCount);
  const setMaxHistoryCount = useMaxHistoryCountStore(state => state.setMaxHistoryCount);
  const setIsFetchingMaxHistoryCount = useMaxHistoryCountStore(state => state.setIsFetchingMaxHistoryCount);

  const fetchMaxHistoryCount = useCallback(async (): Promise<void> => {
    if (isNil(generatedScheduleDepartmentId)) return;

    const request: GetMaxHistoryCountRequest = {
      departmentId: generatedScheduleDepartmentId,
    }

    const maxHistoryCount = await fetchData(
      async () => await getMaxHistoryCountAction(request),
      path => router.push(path),
      undefined,
    )

    setMaxHistoryCount(maxHistoryCount)
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