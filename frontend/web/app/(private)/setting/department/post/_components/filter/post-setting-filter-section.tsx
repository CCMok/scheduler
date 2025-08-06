import { OrganizationDepartments } from "@/libs/server/organization/models/organization-dao";
import PostSettingForm from "./form/post-setting-form";
import { PostSettingFilterStoreProvider } from "@/components/store/setting/post/post-setting-filter-store-provider";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { redirect } from "next/navigation";

const getOrganizations = async (): Promise<OrganizationDepartments[]> => {
  const response = await getOrganizationsService<OrganizationDepartments>({
    include: { departments: true },
  })
  
  const uiResponse = handleServiceResponse(response, path => redirect(path))
  if (!uiResponse.isSuccess) {
    console.error('Failed to get organizations. message title: ', uiResponse.message.title, 'message content: ', uiResponse.message.content)
    return [];
  }

  return uiResponse.data
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