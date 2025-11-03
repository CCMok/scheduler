'use client'

import LoadingButton from '@/components/_general/button/loading-button';
import { createRosterHistoryAction } from "@/libs/server/roster/actions/create-roster-history-action";
import { CreateRosterHistoryRequest, CreateScheduleRequest } from "@/libs/server/roster/models/create-roster-history-request";
import { Dispatch, SetStateAction, useState } from "react";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { postBaseToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { isNil } from "lodash";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useRouter } from "next/navigation";
import { useMaxHistoryCountStore } from './store/max-history-count-store-provider';
import { OffRequest } from '@/libs/server/roster/models/arrange/arrange-roster-request';
import { useCreateRosterStore } from '../../store/create-roster-store-provider';
import { OffFormInput } from '../../filter/form/create-roster-form-input';
import { handleCudResponse } from '@/libs/server/_general/utils/response-utils';
import { MessageTitle } from '@/libs/server/_general/enums/message';

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
  setIsAlertDialogOpen: Dispatch<SetStateAction<boolean>>,
}

export default function RosterTableSaveConfirmButton({
  setIsAlertDialogOpen,
}: Readonly<Props>) {
  const generatedScheduleDepartmentId = useCreateRosterStore(state => state.generatedScheduleDepartmentId);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);
  const modifiedSchedules = useCreateRosterStore(state => state.modifiedSchedules);
  const setInitialSchedules = useCreateRosterStore(state => state.setInitialSchedules);

  const isFetchingMaxHistoryCount = useMaxHistoryCountStore(state => state.isFetchingMaxHistoryCount);

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onClickContinue = async () => {
    setIsLoading(true);
    await saveRoster();
    setIsLoading(false)
    setIsAlertDialogOpen(false)
  }

  const saveRoster = async () => {
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
    })

    setInitialSchedules(modifiedSchedules)
  }

  return (
    <LoadingButton
      disabled={isFetchingMaxHistoryCount || isLoading}
      isLoading={isLoading}
      onClick={onClickContinue}
    >
      繼續
    </LoadingButton>
  )
}