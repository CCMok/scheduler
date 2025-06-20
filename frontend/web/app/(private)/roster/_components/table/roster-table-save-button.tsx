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
import { ServerResponseStatus } from "@/libs/server/_general/enums/server-response-status";
import { getRootMessage } from "@/libs/client/_general/utils/form-utils";
import { toast } from "sonner";
import { MessageTitle } from "@/libs/client/_general/enums/client-message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";

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

export default function RosterTableSaveButton() {
  const { departmentId, postBaseSchedules } = useArrangeRosterStore(state => state);

  const [isLoading, setIsLoading] = useState(false);

  const save = async () => {
    if (isNil(departmentId)) {
      console.error('departmentId is not set')
      toast.error(MessageTitle.SYSTEM_ERROR, {
        ...SONNER_DEFAULT_OPTIONS,
        description: MessageTitle.SYSTEM_ERROR,
      })
      return;
    }

    const request = getRequest(departmentId, postBaseSchedules);

    const response = await saveRosterAction(request);

    if (response.status !== ServerResponseStatus.OK) {
      const rootMessage = getRootMessage(response)
      toast.error(rootMessage.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: rootMessage.content,
      })
      return;
    }

    toast.success(MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已儲存值班表',
    })
  }

  const onClick = async () => {
    // TODO: prompt confirm to only keep 5 latest histories
    setIsLoading(true);
    await save();
    setIsLoading(false)
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