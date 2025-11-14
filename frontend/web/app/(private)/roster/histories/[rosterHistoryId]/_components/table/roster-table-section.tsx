import { RosterHistoryOffWorkerWithDays, RosterHistoryScheduleWithRelated } from "@/libs/roster/models/roster-history-dao";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getRosterHistorySchedulesWithRelatedService } from "@/libs/roster/services/get-roster-history-schedules-service";
import { dayBaseToPostBaseSchedule, rosterHistorySchedulesToDayBaseSchedule } from "@/libs/roster/utils/roster-transform-utils";
import { CreateRosterStoreProvider } from "../../../../new/_components/store/create-roster-store-provider";
import { getRosterHistoriesWithRelatedService } from "@/libs/roster/services/get-roster-histories-with-related-service";
import { isNil } from "lodash";
import { Worker } from '@/external/prisma-generated'
import { getWorkersService } from "@/libs/worker/services/get-workers-service";
import RosterTableClientContainer from "./roster-table-client-container";
import RosterTableResetButton from "../../../../new/_components/table/roster-table-reset-button";
import RosterTableSaveAlertDialog from "./roster-table-save-alert-dialog";
import RosterTableExportXLSXButton from "../../../../new/_components/table/roster-table-export-xlsx-button";
import { getRosterHistoryOffWorkersWithDaysService } from "@/libs/roster/services/get-roster-history-off-workers-with-days-service";
import RosterTableFilterSection from "../filter/roster-table-filter-section";
import { OffFormInput } from "@/app/(private)/roster/new/_components/filter/form/create-roster-form-input";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";

const getRosterHistorySchedules = async (rosterHistoryId: number): Promise<RosterHistoryScheduleWithRelated[]> => {
  const response = await getRosterHistorySchedulesWithRelatedService(undefined, rosterHistoryId)
  return handleGetResponse(response, redirect, [])
}

const getRosterHistoryOffWorkers = async (rosterHistoryId: number): Promise<RosterHistoryOffWorkerWithDays[]> => {
  const response = await getRosterHistoryOffWorkersWithDaysService(undefined, rosterHistoryId)
  return handleGetResponse(response, redirect, [])
}

const getDepartmentId = async (rosterHistoryId: number): Promise<number | undefined> => {
  const response = await getRosterHistoriesWithRelatedService(rosterHistoryId)
  const data = handleGetResponse(response, redirect, [])
  return data[0]?.departmentId
}

const getWorkers = async (departmentId: number): Promise<Worker[]> => {
  const response = await getWorkersService(undefined, departmentId)
  return handleGetResponse(response, redirect, [])
}

const offWorkersToOffFormInputs = (offWorkers: RosterHistoryOffWorkerWithDays[]): OffFormInput[] =>
  offWorkers.map(offWorker => ({
    workerId: offWorker.workerId,
    days: offWorker.rosterHistoryOffWorkerDays.map(day => day.day),
  }))

type Props = {
  rosterHistoryId: number;
}

const RosterTableServerContent = async ({
  rosterHistoryId,
}: Readonly<Props>) => {
  const [rosterHistorySchedules, rosterHistoryOffWorkers, departmentId] = await Promise.all([
    getRosterHistorySchedules(rosterHistoryId),
    getRosterHistoryOffWorkers(rosterHistoryId),
    getDepartmentId(rosterHistoryId),
  ])

  const offFormInputs = offWorkersToOffFormInputs(rosterHistoryOffWorkers)

  if (isNil(departmentId)) return notFound()

  const workers = await getWorkers(departmentId)

  const dayBaseSchedules = rosterHistorySchedulesToDayBaseSchedule(rosterHistorySchedules);
  const postBaseSchedules = dayBaseToPostBaseSchedule(dayBaseSchedules);

  return (
    <CreateRosterStoreProvider
      initState={{
        generatedScheduleDepartmentId: departmentId,
        generatedScheduleWorkers: workers,
        generatedScheduleOffs: offFormInputs,
        initialSchedules: postBaseSchedules,
        modifiedSchedules: postBaseSchedules,
        isGenerated: true,
      }}
    >
      <div className='space-y-4'>
        <RosterTableFilterSection />
        <RosterTableClientContainer />
        <div className='flex justify-end space-x-2'>
          <RosterTableResetButton description="沒有儲存的資料將會遺失，請確認是否繼續。" />
          <RosterTableExportXLSXButton />
          <RosterTableSaveAlertDialog rosterHistoryId={rosterHistoryId} />
        </div>
      </div>
    </CreateRosterStoreProvider>
  )
}

export default function RosterTableSection({
  rosterHistoryId,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <RosterTableServerContent
        rosterHistoryId={rosterHistoryId}
      />
    </Suspense>
  )
}