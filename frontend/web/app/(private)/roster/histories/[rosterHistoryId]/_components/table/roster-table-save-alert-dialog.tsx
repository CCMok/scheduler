'use client';

import { Save } from "lucide-react";
import { useState } from "react";
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from '@/components/_general/button/custom-button';
import LoadingButton from "@/components/_general/button/loading-button";
import { toast } from "sonner";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { CreateOffWorkerRequest, UpdateRosterHistoryRequest } from "@/libs/server/roster/models/update-roster-history-request";
import { postBaseToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { CreateScheduleRequest } from "@/libs/server/roster/models/create-roster-history-request";
import { useArrangeRosterStore } from "../../../../newOld/_components/store/arrange-roster-store-provider";
import { updateRosterHistoryAction } from "@/libs/server/roster/actions/update-roster-history-action";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { useRouter } from "next/navigation";
import { OffFormInput } from "@/libs/client/roster/models/roster-filter-form-input";

const getSaveRosterRequest = (
  rosterHistoryId: number, 
  postBaseSchedules: PostBaseSchedule[],
  offFormInputs: OffFormInput[]
): UpdateRosterHistoryRequest => {
  const dayBaseSchedules = postBaseToDayBaseSchedule(postBaseSchedules)

  const scheduleRequests: CreateScheduleRequest[] = dayBaseSchedules.map(schedule => ({
    ...schedule,
    arrangements: schedule.arrangements.map(arrangement => ({
      postId: arrangement.post.id,
      workerId: arrangement.worker?.id,
    })),
  }))

  const offWorkerRequests: CreateOffWorkerRequest[] = offFormInputs.map(off => ({
    workerId: Number(off.workerId),
    days: off.days.map(day => new Date(day)),
  }))

  return {
    id: rosterHistoryId,
    schedules: scheduleRequests,
    offWorkers: offWorkerRequests,
  }
}

type Props = {
  rosterHistoryId: number;
}

export default function RosterTableSaveAlertDialog({
  rosterHistoryId,
}: Readonly<Props>) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  
  const modifiedSchedules = useArrangeRosterStore(state => state.modifiedSchedules);
  const setInitialSchedules = useArrangeRosterStore(state => state.setInitialSchedules);
  const generatedScheduleOffs = useArrangeRosterStore(state => state.generatedScheduleOffs);

  const router = useRouter()

  const onClickContinue = async () => {
    setIsLoading(true);
    await saveRoster();
    setIsLoading(false)
    setIsAlertDialogOpen(false)
  }

  const saveRoster = async () => {
    const request = getSaveRosterRequest(rosterHistoryId, modifiedSchedules, generatedScheduleOffs);
    const response = await updateRosterHistoryAction(request);

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
          <AlertDialogDescription />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <LoadingButton
            isLoading={isLoading}
            onClick={onClickContinue}
          >
            繼續
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}