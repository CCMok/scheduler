import { Suspense } from "react";
import CreateRosterStoreHandler from "../store/create-roster-store-handler";
import { CreateRosterStoreProvider } from "../store/create-roster-store-provider";
import RosterTableSection from "../table/roster-table-section";
import InputCardSkeleton from "@/components/_general/skeleton/input-card-skeleton";
import CreateRosterFilter from "../filter/create-roster-filter";
import { getOrganizationsService } from "@/libs/organization/services/get-organizations-service";
import { Organization } from "@/external/prisma-generated";
import { redirect } from "next/navigation";
import { handleGetResponse } from "@/libs/_general/utils/response-utils";

const getOrganizations = async (): Promise<Organization[]> => {
  const response = await getOrganizationsService()
  return handleGetResponse(response, redirect, [])
}

export default function CreateRosterPageContent() {
  const organizationsPromise = getOrganizations();

  return (
    <CreateRosterStoreProvider initState={{ saveState: true }}>
      <CreateRosterStoreHandler />
      <div className="space-y-4">
        <Suspense fallback={<InputCardSkeleton />}>
          <CreateRosterFilter organizationsPromise={organizationsPromise} />
        </Suspense>
        <RosterTableSection />
      </div>
    </CreateRosterStoreProvider>
  )
}