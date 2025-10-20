import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { RosterHistoryRelated } from "@/libs/server/roster/models/roster-history-dao";
import { getRosterHistoriesService } from "@/libs/server/roster/services/get-roster-histories-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { format } from "date-fns";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

const getRosterHistory = async (id: number): Promise<RosterHistoryRelated | undefined> => {
  const rosterHistorys = await fetchData(
    async () => await getRosterHistoriesService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )

  return rosterHistorys[0];
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