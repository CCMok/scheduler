import OrganizationSettingNameForm from "./_component/organization-setting-name-form";
import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";

export default async function SettingOrganizationPage() {
  const organizations = await getOrganizationsBySession();

  return (
    <OrganizationSettingNameForm organizations={organizations} />
  )
}