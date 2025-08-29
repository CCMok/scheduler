'use client'

import LoadingButton from "@/components/button/loading-button";
import { useArrangeRosterStore } from "@/app/(private)/roster/_components/store/arrange-roster-store-provider";
import { createRosterHistoryAction } from "@/libs/server/roster/actions/create-roster-history-action";
import { CreateRosterHistoryRequest, CreateScheduleRequest } from "@/libs/server/roster/models/create-roster-request";
import { Dispatch, SetStateAction, useState } from "react";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { postBaseToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { isNil } from "lodash";
import { toast } from "sonner";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useMaxHistoryCountStore } from "@/app/(private)/roster/_components/table/save-button/store/max-history-count-store-provider";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";

const getSaveRosterRequest = (departmentId: number, postBaseSchedules: PostBaseSchedule[]): CreateRosterHistoryRequest => {
  const dayBaseSchedules = postBaseToDayBaseSchedule(postBaseSchedules)

  const scheduleRequests: CreateScheduleRequest[] = dayBaseSchedules.map(schedule => ({
    ...schedule,
    arrangements: schedule.arrangements.map(arrangement => ({
      postId: arrangement.post.id,
      workerId: arrangement.worker?.id,
    })),
  }))

  return {
    departmentId,
    schedules: scheduleRequests,
  }
}

type Props = {
  setIsAlertDialogOpen: Dispatch<SetStateAction<boolean>>,
}

export default function RosterTableSaveConfirmButton({
  setIsAlertDialogOpen,
}: Readonly<Props>) {
  const generatedScheduleDepartmentId = useArrangeRosterStore(state => state.generatedScheduleDepartmentId);
  const modifiedSchedules = useArrangeRosterStore(state => state.modifiedSchedules);
  const setInitialSchedules = useArrangeRosterStore(state => state.setInitialSchedules);

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
      toast.error(UiMessageTitle.SYSTEM_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: UiMessageTitle.SYSTEM_ERROR,
      })
      return;
    }

    const request = getSaveRosterRequest(generatedScheduleDepartmentId, modifiedSchedules);
    const response = await createRosterHistoryAction(request);

    const uiResponse = handleServiceResponse(response, path => router.push(path))
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success(UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已儲存值班表',
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