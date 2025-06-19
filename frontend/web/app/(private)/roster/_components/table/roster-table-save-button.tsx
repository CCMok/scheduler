'use client';

import LoadingButton from "@/components/button/loading-button";
import { useRosterStore } from "@/components/store/roster/roster-store-provider";
import { ArrangeRosterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import { saveRosterAction } from "@/libs/server/roster/action/save-roster-action";
import { SaveRosterRequest } from "@/libs/server/roster/model/save-roster-request";
import { Save } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule";

const getRequest = (departmentId: string, schedules: PostBaseSchedule[]): SaveRosterRequest => {
  // TODO: map schedules
  return {
    departmentId: Number(departmentId),
    schedules: [],
  }
}

export default function RosterTableSaveButton() {
  const { control } = useFormContext<ArrangeRosterFormInput>();

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: '',
  })

  const { postBaseSchedules } = useRosterStore(state => state);

  const [isLoading, setIsLoading] = useState(false);

  const save = async () => {
    const request = getRequest(departmentId, postBaseSchedules);

    const response = await saveRosterAction(request);

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