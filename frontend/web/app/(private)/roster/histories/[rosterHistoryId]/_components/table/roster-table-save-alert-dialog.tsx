'use client';

import { Save } from "lucide-react";
import { useState } from "react";
import { AlertDialogTrigger, AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/external/shadcn/components/ui/alert-dialog";
import CustomButton from '@/components/_general/button/custom-button';
import LoadingButton from "@/components/_general/button/loading-button";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";
import { CreateOffWorkerRequest, UpdateRosterHistoryRequest } from "@/libs/server/roster/models/update-roster-history-request";
import { postBaseToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { CreateScheduleRequest } from "@/libs/server/roster/models/create-roster-history-request";
import { useCreateRosterStore } from "../../../../new/_components/store/create-roster-store-provider";
import { updateRosterHistoryAction } from "@/libs/server/roster/actions/update-roster-history-action";
import { useRouter } from "next/navigation";
import { OffFormInput } from "@/app/(private)/roster/new/_components/filter/form/create-roster-form-input";
import { handleCudResponse } from "@/libs/server/_general/utils/response-utils";
import { isNil } from "lodash";
import { MessageTitle } from "@/libs/server/_general/enums/message";

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
  
  const modifiedSchedules = useCreateRosterStore(state => state.modifiedSchedules);
  const setInitialSchedules = useCreateRosterStore(state => state.setInitialSchedules);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);

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

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('儲存值班表' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
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