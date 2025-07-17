import UpdateOrganizationNameForm from "./_component/organization-name-change-form";
import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";

export default async function OrganizationSettingPage() {
  const organizations = await getOrganizationsBySession();

  return (
    <UpdateOrganizationNameForm organizations={organizations} />
  )
}