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
      // TODO: show internal error
      return;
    }

    const request = getRequest(departmentId, postBaseSchedules);

    const response = await saveRosterAction(request);
    console.log(response)

    // TODO: handle response
  }

  const onClick = async () => {
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