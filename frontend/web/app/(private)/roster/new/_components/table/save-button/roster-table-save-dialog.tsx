'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import RosterTableSaveConfirmDescription from "./roster-table-save-confirm-description";
import { isNil } from "lodash";
import { useRouter } from "next/navigation";
import { getMaxHistoryCountAction } from "@/libs/organization/actions/get-max-history-count-action";
import { useCreateRosterStore } from "../../store/create-roster-store-provider";
import { handleCudResponse, handleGetResponse } from "@/libs/_general/utils/response-utils";
import ConfirmDialog from "@/components/_general/dialog/confirm-dialog";
import LoadingButton from "@/components/_general/button/loading-button";
import { toast } from "sonner";
import { MessageTitle } from "@/libs/_general/enums/message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { PostBaseSchedule } from "@/libs/roster/models/schedule";
import { OffFormInput } from "../../filter/form/create-roster-form-input";
import { CreateRosterHistoryRequest, CreateScheduleRequest } from "@/libs/roster/models/create-roster-history-request";
import { postBaseToDayBaseSchedule } from "@/libs/roster/utils/roster-transform-utils";
import { OffRequest } from "@/libs/roster/models/create-roster-request";
import { createRosterHistoryAction } from "@/libs/roster/actions/create-roster-history-action";

const getSaveRosterRequest = (
  departmentId: number,
  postBaseSchedules: PostBaseSchedule[],
  offs: OffFormInput[],
): CreateRosterHistoryRequest => {
  const dayBaseSchedules = postBaseToDayBaseSchedule(postBaseSchedules)

  const scheduleRequests: CreateScheduleRequest[] = dayBaseSchedules.map(schedule => ({
    ...schedule,
    arrangements: schedule.arrangements.map(arrangement => ({
      postId: arrangement.post.id,
      workerId: arrangement.worker?.id,
    })),
  }))

  const offRequests: OffRequest[] = offs.map(off => ({
    workerId: Number(off.workerId),
    days: off.days.map(day => new Date(day)),
  }))

  return {
    departmentId,
    schedules: scheduleRequests,
    offs: offRequests,
  }
}

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function RosterTableSaveDialog({
  isOpen,
  setIsOpen,
}: Readonly<Props>) {
  const router = useRouter();

  const generatedScheduleDepartmentId = useCreateRosterStore(state => state.generatedScheduleDepartmentId);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);
  const modifiedSchedules = useCreateRosterStore(state => state.modifiedSchedules);
  const setInitialSchedules = useCreateRosterStore(state => state.setInitialSchedules);

  const [isFetchingMaxHistoryCount, setIsFetchingMaxHistoryCount] = useState(false);
  const [maxHistoryCount, setMaxHistoryCount] = useState<number | undefined>(undefined);

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
    if (!isOpen) {
      previousDepartmentId.current = false;
      return;
    }

    if (!previousDepartmentId.current) {
      onDialogOpen();
    }

    previousDepartmentId.current = true;
  }, [isOpen, onDialogOpen]);

  const onConfirm = async () => {
    if (isNil(generatedScheduleDepartmentId)) {
      console.error('departmentId is not set')
      toast.error(MessageTitle.INTERNAL_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
      })
      return;
    }

    const request = getSaveRosterRequest(generatedScheduleDepartmentId, modifiedSchedules, generatedScheduleOffs);
    const response = await createRosterHistoryAction(request);

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('儲存值班表' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '可在值班表 > 紀錄中查看。',
    })

    setInitialSchedules(modifiedSchedules)
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="確定要儲存值班表嗎?"
      description={<RosterTableSaveConfirmDescription 
        maxHistoryCount={maxHistoryCount}
        isFetchingMaxHistoryCount={isFetchingMaxHistoryCount}
      />}
      onConfirm={onConfirm}
      renderConfirmButton={(isLoading, onClick) => (
        <LoadingButton
          disabled={isFetchingMaxHistoryCount || isLoading}
          isLoading={isLoading}
          onClick={onClick}
        >
          確定
        </LoadingButton>
      )}
    />
  )
}