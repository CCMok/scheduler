'use client';

import LoadingButton from "@/components/button/loading-button";
import { useRosterStore } from "@/components/store/roster/roster-store-provider";
import { RosterFilterFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import { saveRosterAction } from "@/libs/server/roster/action/save-roster-action";
import { Schedule } from "@/libs/server/roster/model/roster";
import { SaveRosterRequest } from "@/libs/server/roster/model/save-roster-request";
import { Save } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";

const getRequest = (departmentId: string, schedules: Schedule[]): SaveRosterRequest => {
  // TODO: map schedules
  return {
    departmentId: Number(departmentId),
    schedules: [],
  }
}

export default function RosterTableSaveButton() {
  const { control } = useFormContext<RosterFilterFormInput>();

  const departmentId = useWatch({
    control,
    name: 'departmentId',
    defaultValue: '',
  })

  const { schedules } = useRosterStore(state => state);

  const [isLoading, setIsLoading] = useState(false);

  const save = async () => {
    const request = getRequest(departmentId, schedules);

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