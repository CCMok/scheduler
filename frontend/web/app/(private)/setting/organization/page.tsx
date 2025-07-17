import UpdateOrganizationNameForm from "./_components/update-organization-name-form";
import { getOrganizationsBySession } from "@/libs/server/organization/repositories/organization-repository";

export default async function OrganizationSettingPage() {
  const organizations = await getOrganizationsBySession();

  return (
    <UpdateOrganizationNameForm organizations={organizations} />
  )
}