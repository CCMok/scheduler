import WorkerSettingForm from "./form/worker-setting-form";
import { WorkerSettingFilterStoreProvider } from "@/components/store/setting/worker/worker-setting-filter-store-provider";
import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { redirect } from "next/navigation";
import { GetOrganizationsRequest, OrganizationRelate } from "@/libs/server/organization/models/get-organizations-request";
import { fetchData } from "@/libs/share/_general/utils/fetch";

const getOrganizations = async (): Promise<OrganizationDepartments[]> => {
  const request: GetOrganizationsRequest = {
    relate: [OrganizationRelate.DEPARTMENT],
    orderBy: [
      { field: 'name' },
      { level: OrganizationRelate.DEPARTMENT, field: 'name' },
    ]
  }

  return await fetchData(
    async () => await getOrganizationsService<OrganizationDepartments>(request),
    path => redirect(path),
  )
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