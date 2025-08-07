import WorkerSettingForm from "./form/worker-setting-form";
import { WorkerSettingFilterStoreProvider } from "@/components/store/setting/worker/worker-setting-filter-store-provider";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { redirect } from "next/navigation";
import { Prisma } from "@/external/prisma-generated";

const getOrganizations = async (): Promise<OrganizationDepartments[]> => {
  const response = await getOrganizationsService<OrganizationDepartments>({
    include: {
      departments: {
        orderBy: { name: Prisma.SortOrder.asc },
      }
    },
    orderBy: { name: Prisma.SortOrder.asc },
  })


  const uiResponse = handleServiceResponse(response, path => redirect(path))
  if (!uiResponse.isSuccess) {
    console.error('Failed to get organizations. message title: ', uiResponse.message.title, 'message content: ', uiResponse.message.content)
    return [];
  }

  return uiResponse.data
}

export default async function WorkerSettingFilterSection() {
  const organizations = await getOrganizations()

  return (
    <section>
      <WorkerSettingFilterStoreProvider initState={{ organizations }}>
        <WorkerSettingForm />
      </WorkerSettingFilterStoreProvider>
    </section>
  )
}