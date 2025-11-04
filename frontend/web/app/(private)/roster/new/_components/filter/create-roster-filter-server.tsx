import CreateRosterFilter from "./create-roster-filter";
import { getOrganizationsService } from "@/libs/organization/services/get-organizations-service";
import { redirect } from "next/navigation";
import { Organization } from "@/external/prisma-generated";
import { Suspense } from "react";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";
import { CreateRosterFilterStoreProvider } from "./store/create-roster-filter-store-provider";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getOrganizations = async (): Promise<Organization[]> => {
  const response = await getOrganizationsService()
  return handleGetResponse(response, redirect, [])
}

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