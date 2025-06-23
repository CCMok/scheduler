'use client';

import LoadingButton from "@/components/button/loading-button";
import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider";
import { saveRosterAction } from "@/libs/server/roster/action/save-roster-action";
import { SaveRosterRequest, SaveScheduleRequest } from "@/libs/server/roster/model/save-roster-request";
import { Save } from "lucide-react";
import { useState } from "react";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { postBaseToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { isNil } from "lodash";
import { toast } from "sonner";
import { ClientMessageTitle } from "@/libs/client/_general/enums/client-message-enum";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { ClientMessage } from "@/libs/client/_general/models/client-message-model";
import { ServerResponse } from "@/libs/share/_general/model/server-response";
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook";

const getRequest = (departmentId: number, postBaseSchedules: PostBaseSchedule[]): SaveRosterRequest => {
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

const onSuccess = () => {
  toast.success(ClientMessageTitle.SUCCESS, {
    ...SONNER_DEFAULT_OPTIONS,
    description: '已儲存值班表',
  })
}

const onError = (_: ServerResponse, clientMessage: ClientMessage) => {
  toast.error(clientMessage.title, {
    ...SONNER_DEFAULT_OPTIONS,
    description: clientMessage.content,
  })
}

export default function RosterTableSaveButton() {
  const { departmentId, postBaseSchedules } = useArrangeRosterStore(state => state);
  const { handleServerResponse } = useServerResponseHandler();

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    // TODO: prompt confirm to only keep 5 latest histories
    setIsLoading(true);
    await save();
    setIsLoading(false)
  }

  const save = async () => {
    if (isNil(departmentId)) {
      console.error('departmentId is not set')
      toast.error(ClientMessageTitle.SYSTEM_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: ClientMessageTitle.SYSTEM_ERROR,
      })
      return;
    }

    const request = getRequest(departmentId, postBaseSchedules);

    const response = await saveRosterAction(request);

    await handleServerResponse(response, onSuccess, onError)
  }

  return (
    <LoadingButton
      icon={<Save />}
      onClick={onClick}
      isLoading={isLoading}
    >
      儲存
    </LoadingButton>
  )
}