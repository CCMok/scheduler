import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { RosterHistoryScheduleRelated } from "@/libs/server/roster/models/roster-history-dao";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getRosterHistorySchedulesService } from "@/libs/server/roster/services/get-roster-history-schedules-service";
import { dayBaseToPostBaseSchedule, rosterHistorySchedulesToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { ArrangeRosterStoreProvider } from "../../../new/_components/store/arrange-roster-store-provider";
import { getRosterHistoriesService } from "@/libs/server/roster/services/get-roster-histories-service";
import { isNil } from "lodash";
import { Worker } from '@/external/prisma-generated'
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import RosterTableClientContainer from "./roster-table-client-container";

const getRosterHistorySchedules = async (rosterHistoryId: number): Promise<RosterHistoryScheduleRelated[]> => {
  return await fetchData(
    async () => await getRosterHistorySchedulesService({
      where: { rosterHistoryId },
    }),
    path => redirect(path),
    [],
  )
}

const getDepartmentId = async (rosterHistoryId: number): Promise<number | undefined> => {
  const rosterHistory = await fetchData(
    async () => await getRosterHistoriesService({
      where: { id: rosterHistoryId },
    }),
    path => redirect(path),
    [],
  )

  return rosterHistory[0]?.departmentId
}

const getWorkers = async (departmentId: number): Promise<Worker[]> => {
  return await fetchData(
    async () => await getWorkersService({
      where: { departmentId },
    }),
    path => redirect(path),
    [],
  )
}

type Props = {
  rosterHistoryId: number;
}

const RosterTableServerContent = async ({
  rosterHistoryId,
}: Readonly<Props>) => {
  const [rosterHistorySchedules, departmentId] = await Promise.all([
    getRosterHistorySchedules(rosterHistoryId), 
    getDepartmentId(rosterHistoryId),
  ])

  if (!rosterHistorySchedules || isNil(departmentId)) return notFound()

  const workers = await getWorkers(departmentId)

  const dayBaseSchedules = rosterHistorySchedulesToDayBaseSchedule(rosterHistorySchedules);
  const postBaseSchedules = dayBaseToPostBaseSchedule(dayBaseSchedules);

  return (
    <ArrangeRosterStoreProvider
      initState={{
        generatedScheduleDepartmentId: departmentId,
        generatedScheduleWorkers: workers,
        initialSchedules: postBaseSchedules,
        modifiedSchedules: postBaseSchedules,
        isGenerated: true,
      }}
    >
      <RosterTableClientContainer />
    </ArrangeRosterStoreProvider>
  )
}

export default function RosterTableServer({
  rosterHistoryId,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <RosterTableServerContent
        rosterHistoryId={rosterHistoryId}
      />
    </Suspense>
  )
}