import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";
import PostSettingForm from "./form/post-setting-form";
import { PostSettingFilterStoreProvider } from "@/app/(private)/setting/posts/_components/manage-post/filter/store/post-setting-filter-store-provider";
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
    [],
  )
}

export default async function PostSettingFilterSection() {
  const organizations = await getOrganizations();

  return (
    <section>
      <PostSettingFilterStoreProvider initState={{ organizations }}>
        <PostSettingForm />
      </PostSettingFilterStoreProvider>
    </section>
  )
}