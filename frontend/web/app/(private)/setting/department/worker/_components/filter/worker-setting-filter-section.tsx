import { getOrganizationsBySessionIncludeDepartments } from "@/libs/server/organization/repositories/organization-repository";
import WorkerSettingForm from "./form/worker-setting-form";
import { WorkerSettingFilterStoreProvider } from "@/components/store/setting/worker/worker-setting-filter-store-provider";

export default async function WorkerSettingFilterSection() {
  const organizations = await getOrganizationsBySessionIncludeDepartments()

  return (
    <section>
      <WorkerSettingFilterStoreProvider initState={{ organizations }}>
        <WorkerSettingForm />
      </WorkerSettingFilterStoreProvider>
    </section>
  )
}