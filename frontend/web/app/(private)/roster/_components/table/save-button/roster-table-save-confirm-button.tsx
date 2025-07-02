'use client'

import LoadingButton from "@/components/button/loading-button";
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider";
import { saveRosterAction } from "@/libs/server/roster/action/save-roster-action";
import { SaveRosterRequest, SaveScheduleRequest } from "@/libs/server/roster/model/save-roster-request";
import { Dispatch, SetStateAction, useState } from "react";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { postBaseToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { isNil } from "lodash";
import { toast } from "sonner";
import { ClientMessageTitle } from "@/libs/client/_general/enums/client-message-enum";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { ClientMessage } from "@/libs/client/_general/models/client-message-model";
import { ServerResponse } from "@/libs/share/_general/model/server-response";
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook";
import useMaxHistoryCount from "./max-history-count-hook";

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

const onSaveRosterError = (_: ServerResponse, clientMessage: ClientMessage) => {
  toast.error(clientMessage.title, {
    ...SONNER_DEFAULT_OPTIONS,
    description: clientMessage.content,
  })
}

type Props = {
  setIsAlertDialogOpen: Dispatch<SetStateAction<boolean>>,
}

export default function RosterTableSaveConfirmButton({
  setIsAlertDialogOpen,
}: Readonly<Props>) {
  const { generatedScheduleDepartmentId, modifiedSchedules, setInitialSchedules } = useArrangeRosterStore(state => state);
  const { handleServerResponse } = useServerResponseHandler();
  const { isFetchingMaxHistoryCount } = useMaxHistoryCount();

  const [isLoading, setIsLoading] = useState(false);

  const onClickContinue = async () => {
    setIsLoading(true);
    await saveRoster();
    setIsLoading(false)
    setIsAlertDialogOpen(false)
  }

  const saveRoster = async () => {
    if (isNil(generatedScheduleDepartmentId)) {
      console.error('departmentId is not set')
      toast.error(ClientMessageTitle.SYSTEM_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: ClientMessageTitle.SYSTEM_ERROR,
      })
      return;
    }

    const request = getSaveRosterRequest(generatedScheduleDepartmentId, modifiedSchedules);
    const response = await saveRosterAction(request);

    await handleServerResponse(response, onSaveRosterSuccess, onSaveRosterError)
  }

  const onSaveRosterSuccess = () => {
    toast.success(ClientMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已儲存值班表',
    })

    setInitialSchedules(modifiedSchedules)
  }

  return (
    <LoadingButton
      disabled={isFetchingMaxHistoryCount || undefined}
      isLoading={isLoading}
      onClick={onClickContinue}
    >
      繼續
    </LoadingButton>
  )
}