import { getOrganizationsBySessionIncludeDepartments } from "@/libs/server/organization/repositories/organization-repository";
import PostSettingForm from "./form/post-setting-form";
import { PostSettingFilterStoreProvider } from "@/components/store/setting/post/post-setting-filter-store-provider";

export default async function PostSettingFilterSection() {
  const organizations = await getOrganizationsBySessionIncludeDepartments()

  return (
    <section>
      <PostSettingFilterStoreProvider initState={{ organizations }}>
        <PostSettingForm />
      </PostSettingFilterStoreProvider>
    </section>
  )
}