'use client'

import LoadingButton from "@/components/button/loading-button";
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider";
import { saveRosterAction } from "@/libs/server/roster/actions/save-roster-action";
import { SaveRosterRequest, SaveScheduleRequest } from "@/libs/server/roster/models/save-roster-request";
import { Dispatch, SetStateAction, useState } from "react";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { postBaseToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { isNil } from "lodash";
import { toast } from "sonner";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { useMaxHistoryCountStore } from "@/components/store/roster/save/max-history-count-store-provider";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";

const getSaveRosterRequest = (departmentId: number, postBaseSchedules: PostBaseSchedule[]): SaveRosterRequest => {
  const dayBaseSchedules = postBaseToDayBaseSchedule(postBaseSchedules)

  const scheduleRequests: SaveScheduleRequest[] = dayBaseSchedules.map(schedule => ({
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
    const response = await saveRosterAction(request);

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