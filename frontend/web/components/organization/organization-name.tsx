import { Organization } from "@/external/prisma-generated";
import { Skeleton } from "@/external/shadcn/components/ui/skeleton";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { isNil } from "lodash";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

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

export type Props = {
  id?: number;
  failNotFound?: boolean;
}

async function OrganizationNameContent({
  id,
  failNotFound = false,
}: Readonly<Props>) {
  if (isNil(id)) {
    if (failNotFound) notFound();
    return '';
  }

  const organization = await getOrganization(id);
  if (!organization) {
    if (failNotFound) notFound();
    return '';
  }

  return organization.name;
}

export default function OrganizationName({
  id,
  failNotFound,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<Skeleton className='h-4 w-20' />}>
      <OrganizationNameContent
        id={id}
        failNotFound={failNotFound}
      />
    </Suspense>
  )
}