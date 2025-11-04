import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import { RosterHistoryWithRelated } from "@/libs/roster/models/roster-history-dao";
import { getRosterHistoriesWithRelatedService } from "@/libs/roster/services/get-roster-histories-with-related-service";
import { format } from "date-fns";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const getRosterHistory = async (id: number): Promise<RosterHistoryWithRelated | undefined> => {
  const response = await getRosterHistoriesWithRelatedService(id)
  const data = handleGetResponse(response, redirect, [])
  return data[0]
}

export type Props = {
  id?: number;
  failNotFound?: boolean;
}

async function RosterHistoryNameContent({
  id,
  failNotFound = false,
}: Readonly<Props>) {
  if (isNil(id)) {
    if (failNotFound) notFound();
    return '';
  }

  const rosterHistory = await getRosterHistory(id);
  if (!rosterHistory) {
    if (failNotFound) notFound();
    return '';
  }

  return format(rosterHistory.createdAt, 'yyyy-MM-dd HH:mm:ss');
}

export default function RosterHistoryName({
  id,
  failNotFound,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<Skeleton className='h-4 w-20' />}>
      <RosterHistoryNameContent
        id={id}
        failNotFound={failNotFound}
      />
    </Suspense>
  )
}