'use client';

import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { PostBaseSchedule } from "@/libs/roster/models/schedule";
import { CreateOffWorkerRequest, UpdateRosterHistoryRequest } from "@/libs/roster/models/update-roster-history-request";
import { postBaseToDayBaseSchedule } from "@/libs/roster/utils/roster-transform-utils";
import { CreateScheduleRequest } from "@/libs/roster/models/create-roster-history-request";
import { updateRosterHistoryAction } from "@/libs/roster/actions/update-roster-history-action";
import { useRouter } from "next/navigation";
import { OffFormInput } from "@/app/(private)/roster/new/_components/filter/form/create-roster-form-input";
import { handleCudResponse } from "@/libs/_general/utils/response-utils";
import { isNil } from "lodash";
import { MessageTitle } from "@/libs/_general/enums/message";
import { useCreateRosterStore } from "@/app/(private)/roster/new/_components/store/create-roster-store-provider";
import ConfirmDialog from "@/components/_general/dialog/confirm-dialog";

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
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function RosterTableSaveDialog({
  rosterHistoryId,
  isOpen,
  setIsOpen,
}: Readonly<Props>) {  
  const modifiedSchedules = useCreateRosterStore(state => state.modifiedSchedules);
  const setInitialSchedules = useCreateRosterStore(state => state.setInitialSchedules);
  const generatedScheduleOffs = useCreateRosterStore(state => state.generatedScheduleOffs);

  const router = useRouter()

  const onContinue = async () => {
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
    <ConfirmDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="確定要儲存值班表嗎?"
      onConfirm={onContinue}
    />
  )
}