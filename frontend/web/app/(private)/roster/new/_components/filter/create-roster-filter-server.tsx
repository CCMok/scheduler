import CreateRosterFilter from "./create-roster-filter";
import { getAllOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { redirect } from "next/navigation";
import { fetchData } from "@/libs/share/_general/utils/fetch";
import { Organization } from "@/external/prisma-generated";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";
import { CreateRosterFilterStoreProvider } from "./store/create-roster-filter-store-provider";

const getOrganizations = async (): Promise<Organization[]> =>
  await fetchData(
    async () => await getAllOrganizationsService(),
    path => redirect(path),
    [],
  )

const CreateRosterFilterServerContent = async () => {
  const organizations = await getOrganizations();
  return (
    <CreateRosterFilterStoreProvider initState={{ organizations }}>
      <CreateRosterFilter organizations={organizations} />
    </CreateRosterFilterStoreProvider>
  )
}

export default async function CreateRosterFilterServer() {
  return (
    <Suspense fallback={<InputCardSkeleton />}>
      <CreateRosterFilterServerContent />
    </Suspense>
  )
}