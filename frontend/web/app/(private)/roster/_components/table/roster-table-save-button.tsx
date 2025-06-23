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
import { AlertDialogHeader, AlertDialogTrigger, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from "@/components/button/custom-button";
import { MAX_HISTORY_COUNT } from "@/libs/share/roster/constants/roster-constant";

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

const onError = (_: ServerResponse, clientMessage: ClientMessage) => {
  toast.error(clientMessage.title, {
    ...SONNER_DEFAULT_OPTIONS,
    description: clientMessage.content,
  })
}

export default function RosterTableSaveButton() {
  const { departmentId, modifiedSchedules, setInitialSchedules } = useArrangeRosterStore(state => state);
  const { handleServerResponse } = useServerResponseHandler();

  const [isLoading, setIsLoading] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const onClickContinue = async () => {
    setIsLoading(true);
    await save();
    setIsLoading(false)
    setIsAlertDialogOpen(false)
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

    const request = getRequest(departmentId, modifiedSchedules);

    const response = await saveRosterAction(request);

    await handleServerResponse(response, onSuccess, onError)
  }

  const onSuccess = () => {
    toast.success(ClientMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
      description: '已儲存值班表',
    })

    setInitialSchedules(modifiedSchedules)
  }

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
            只能儲存最多 {MAX_HISTORY_COUNT} 個值班表，請確認是否繼續。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <LoadingButton isLoading={isLoading} onClick={onClickContinue}>繼續</LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}