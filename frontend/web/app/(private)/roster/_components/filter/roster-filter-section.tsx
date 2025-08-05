import { ClassNameProps } from "@/libs/share/_general/props/class-name-props";
import { ArrangeRosterFilterStoreProvider } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";
import { getOrganizationsBySessionIncludeDepartments } from "@/libs/server/organization/repositories/organization-repository";
import ArrangeRosterForm from "../form/arrange-roster-form";
import RosterFilterStateUpdater from "./roster-filter-state-updater";
import { Worker } from "@/external/prisma-generated";
import { GetWorkersRequest } from "@/libs/server/worker/models/get-workers-request";
import { getWorkers } from "@/libs/server/worker/services/get-workers-service";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { redirect } from "next/navigation";

const getWorkersFromService = async (departmentId?: string): Promise<Worker[]> => {
  const departmentIdNumber = Number(departmentId);
  if (isNaN(departmentIdNumber)) return [];

  const request: GetWorkersRequest = {
    departmentId: departmentIdNumber,
  }

  const response = await getWorkers(request)

  const uiResponse = handleServiceResponse(response, path => redirect(path))
  if (!uiResponse.isSuccess) {
    console.error(`Failed to get workers. message title: ${uiResponse.message.title}, content: ${uiResponse.message.content}`)
    return []
  }

  return uiResponse.data;
}

type Props = ClassNameProps & {
  departmentId?: string
}

export default async function RosterFilterSection({
  className,
  departmentId,
}: Readonly<Props>) {
  const workers = await getWorkersFromService(departmentId)

  const organizations = await getOrganizationsBySessionIncludeDepartments()

  return (
    <section className={className}>
      <ArrangeRosterFilterStoreProvider initState={{ organizations }}>
        <RosterFilterStateUpdater workers={workers} />
        <ArrangeRosterForm />
      </ArrangeRosterFilterStoreProvider>
    </section>
  )
}