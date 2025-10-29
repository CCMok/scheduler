import { Organization } from "@/external/prisma-generated"
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { notFound, redirect } from "next/navigation"
import UpdateOrganizationNameSection from "./update-organization-name-section"
import { Suspense } from "react"
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton"

const getOrganization = async (id: number): Promise<Organization | undefined> => {
  const organizations = await fetchData(
    async () => await getOrganizationsService({
      where: { id },
    }),
    path => redirect(path),
    [],
  )

  return organizations[0];
}

type Props = {
  id: number;
}

async function UpdateOrganizationNameSectionServerContent({
  id,
}: Readonly<Props>) {
  const organization = await getOrganization(id);
  if (!organization) notFound();

  return (
    <UpdateOrganizationNameSection
      organization={organization}
    />
  )
}

export default function UpdateOrganizationNameSectionServer({
  id,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <UpdateOrganizationNameSectionServerContent id={id} />
    </Suspense>
  )
}