'use client'

import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider";
import { useEffect, useState } from "react";
import { isNil } from "lodash";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/model/server-response";
import useServerResponseHandler from "@/libs/client/_general/hooks/server-response-handler-hook";
import { GetMaxHistoryCountRequest } from "@/libs/server/organization/models/get-max-history-count-request";
import { GetMaxHistoryCountResponse } from "@/libs/server/organization/models/get-max-history-count-response";
import { getMaxHistoryCountAction } from "@/libs/server/organization/actions/get-max-history-count-action";

const getGetMaxHistoryCountRequest = (departmentId: number): GetMaxHistoryCountRequest => ({
  departmentId,
})

const onGetMaxHistoryCountError = (error: ServerResponse) => {
  console.error(error)
}

export default function useMaxHistoryCount() {
  const { generatedScheduleDepartmentId } = useArrangeRosterStore(state => state);
  const { handleServerResponse } = useServerResponseHandler();

  const [maxHistoryCount, setMaxHistoryCount] = useState<number | undefined>(undefined);
  const [isFetchingMaxHistoryCount, setIsFetchingMaxHistoryCount] = useState(false);

  const onGetMaxHistoryCountSuccess = (response: SuccessResponse<GetMaxHistoryCountResponse>) => {
    if (isNil(response.data.maxHistoryCount)) return;
    setMaxHistoryCount(response.data.maxHistoryCount)
  }

  useEffect(() => {
    if (isNil(generatedScheduleDepartmentId)) return;

    const request = getGetMaxHistoryCountRequest(generatedScheduleDepartmentId);

    (async () => {
      setIsFetchingMaxHistoryCount(true);
      const response = await getMaxHistoryCountAction(request)
      handleServerResponse(response, onGetMaxHistoryCountSuccess, onGetMaxHistoryCountError)
      setIsFetchingMaxHistoryCount(false);
    })();
  }, [generatedScheduleDepartmentId, handleServerResponse])

  return { maxHistoryCount, isFetchingMaxHistoryCount }
}