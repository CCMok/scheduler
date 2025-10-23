import TableSkeleton from "@/components/_general/skeleton/table-skeleton";
import { RosterHistoryOffWorkerRelated, RosterHistoryScheduleRelated } from "@/libs/server/roster/models/roster-history-dao";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getRosterHistorySchedulesService } from "@/libs/server/roster/services/get-roster-history-schedules-service";
import { dayBaseToPostBaseSchedule, rosterHistorySchedulesToDayBaseSchedule } from "@/libs/client/roster/utils/roster-transform-utils";
import { ArrangeRosterStoreProvider } from "../../../../new/_components/store/arrange-roster-store-provider";
import { getRosterHistoriesService } from "@/libs/server/roster/services/get-roster-histories-service";
import { isNil } from "lodash";
import { Worker } from '@/external/prisma-generated'
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import RosterTableClientContainer from "./roster-table-client-container";
import RosterTableResetButton from "../../../../new/_components/table/roster-table-reset-button";
import RosterTableSaveAlertDialog from "./roster-table-save-alert-dialog";
import RosterTableExportXLSXButton from "../../../../new/_components/table/roster-table-export-xlsx-button";
import CustomCard from "@/components/_general/card/custom-card";
import { DepartmentOrganization } from "@/libs/server/department/models/department-dao";
import { getDepartmentsOrganizationService } from "@/libs/server/department/services/get-departments-organization-service";
import { getRosterHistoryOffWorkersService } from "@/libs/server/roster/services/get-roster-history-off-workers-service";
import { OffFormInput } from "@/libs/client/roster/models/roster-filter-form-input";
import RosterTableFilterSection from "../filter/roster-table-filter-section";

const getRosterHistorySchedules = async (rosterHistoryId: number): Promise<RosterHistoryScheduleRelated[]> => {
  return await fetchData(
    async () => await getRosterHistorySchedulesService({
      where: { rosterHistoryId },
    }),
    path => redirect(path),
    [],
  )
}

const getRosterHistoryOffWorkers = async (rosterHistoryId: number): Promise<RosterHistoryOffWorkerRelated[]> => {
  return await fetchData(
    async () => await getRosterHistoryOffWorkersService({
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

const getDepartment = async (departmentId: number): Promise<DepartmentOrganization | undefined> => {
  const department = await fetchData(
    async () => await getDepartmentsOrganizationService({
      where: { id: departmentId },
    }),
    path => redirect(path),
    [],
  )
  return department[0]
}

const offWorkersToOffFormInputs = (offWorkers: RosterHistoryOffWorkerRelated[]): OffFormInput[] =>
  offWorkers.map(offWorker => ({
    workerId: offWorker.workerId.toString(),
    days: offWorker.rosterHistoryOffWorkerDays.map(day => day.day.toISOString()),
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

  const [department, workers] = await Promise.all([
    getDepartment(departmentId),
    getWorkers(departmentId),
  ])

  if (!department) return notFound()

  const dayBaseSchedules = rosterHistorySchedulesToDayBaseSchedule(rosterHistorySchedules);
  const postBaseSchedules = dayBaseToPostBaseSchedule(dayBaseSchedules);

  return (
    <ArrangeRosterStoreProvider
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
        <CustomCard
          title={`${department.organization.name} - ${department.name}`}
        >
          <RosterTableClientContainer />
          <div className='flex justify-end space-x-2'>
            <RosterTableResetButton description="沒有儲存的資料將會遺失，請確認是否繼續。" />
            <RosterTableExportXLSXButton />
            <RosterTableSaveAlertDialog rosterHistoryId={rosterHistoryId} />
          </div>
        </CustomCard>
      </div>
    </ArrangeRosterStoreProvider>
  )
}

export default function RosterTableSection({
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