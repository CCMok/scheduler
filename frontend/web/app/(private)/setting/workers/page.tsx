import { SearchParamProps } from '@/libs/share/_general/props/param-props';
import { WorkerParam } from './_components/worker-param';
import { Param } from '@/libs/share/_general/enums/param';
import { toNumber } from '@/libs/share/_general/utils/number';
import { fetchData } from '@/libs/share/_general/utils/fetch';
import { redirect } from 'next/navigation';
import { WorkerDeptOrg } from '@/libs/server/worker/models/worker-dao';
import { getWorkersDeptOrgService } from '@/libs/server/worker/services/get-workers-dept-org-service';
import WorkerFilter from './_components/worker-filter';
import WorkerTable from './_components/worker-table';
import CustomCard from '@/components/_general/card/custom-card';

const getWorkers = async (deptId?: number, orgId?: number): Promise<WorkerDeptOrg[]> => {
  return await fetchData(
    async () => await getWorkersDeptOrgService({
      where: { deptId, orgId },
    }),
    path => redirect(path),
    [],
  )
}

type Props = SearchParamProps<{
  [Param.ID]: string | undefined,
  [WorkerParam.ORGANIZATION_ID]: string | undefined,
  [WorkerParam.DEPARTMENT_ID]: string | undefined,
}>

export default async function WorkersSettingPage({
  searchParams,
}: Readonly<Props>) {
  const params = await searchParams;
  const orgId = toNumber(params.organizationId);
  const deptId = toNumber(params.departmentId);

  const workers = await getWorkers(deptId, orgId);

  return (
    <CustomCard>
      <WorkerFilter orgId={orgId} />
      <WorkerTable workers={workers} />
    </CustomCard>
  )
}