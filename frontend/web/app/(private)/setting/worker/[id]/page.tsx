import { ParamProps } from "@/libs/share/_general/props/param-props";
import { Param } from "@/libs/share/_general/enums/param";
import { notFound, redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import IndividualSettingLayout from "@/components/layout/setting/individual-setting-layout";
import { Worker } from "@/external/prisma-generated";
import { getWorkersService } from "@/libs/server/worker/services/get-workers-service";
import UpdateWorkerNameSection from "./_components/update-name/update-worker-name-section";

const getWorkerPosts = async (id: number): Promise<Worker | undefined> => {
  const workers = await fetchData(
    async () => getWorkersService({ where: { id } }),
    path => redirect(path),
    [],
  )
  return workers[0]
}

type Props = ParamProps<{ [Param.ID]: string }>

export default async function WorkerEditPage({
  params,
}: Readonly<Props>) {
  const paramId = (await params).id;
  const id = Number(paramId);
  if (isNaN(id)) notFound();

  const worker = await getWorkerPosts(id);
  if (!worker) notFound()

  return (
    <IndividualSettingLayout
      title={worker.name}
      updateNameSection={<UpdateWorkerNameSection worker={worker} />}
      // TODO
      // otherSection={<ChildrenSection departmentId={id} />}
    />
  )
}