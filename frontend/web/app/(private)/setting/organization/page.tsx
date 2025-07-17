import UpdateOrganizationNameForm from "./_component/update-organization-name-form";
import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";

export default async function OrganizationSettingPage() {
  const organizations = await getOrganizationsBySession();

  return (
    <UpdateOrganizationNameForm organizations={organizations} />
  )
}