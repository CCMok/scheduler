import CustomCard from "@/components/_general/card/custom-card";
import { Organization } from "@/external/prisma-generated";
import { getOrganizationsService } from "@/libs/server/organization/services/get-organizations-service";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import UserOrganizationTable from "./table/user-organization-table";
import TableCardSkeleton from "@/components/_general/skeleton/table-card-skeleton";
import UserOrganizationFilter from "./filter/user-organization-filter";
import AssignOrganizationDialog from "./assign/assign-organization-dialog";
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils";

const getUserOrganizations = async (userId: number): Promise<Organization[]> => {
  const response = await getOrganizationsService(undefined, undefined, userId)
  return handleGetResponse(response, redirect, [])
}

const getOrganizations = async (): Promise<Organization[]> => {
  const response = await getOrganizationsService()
  return handleGetResponse(response, redirect, [])
}

type Props = {
  id: number;
}

const UserOrganizationTableContent = async ({
  id,
}: Readonly<Props>) => {
  const [userOrganizations, organizations] = await Promise.all([
    getUserOrganizations(id),
    getOrganizations(),
  ])

  const assignableOrganizations = organizations.filter(organization =>
    !userOrganizations.some(userOrganization => userOrganization.id === organization.id)
  );

  return (
    <CustomCard>
      <UserOrganizationFilter button={<AssignOrganizationDialog organizations={assignableOrganizations} />} />
      <UserOrganizationTable organizations={userOrganizations} />
    </CustomCard>
  )
}

export default function UserOrganizationsSection({
  id,
}: Readonly<Props>) {
  return (
    <Suspense fallback={<TableCardSkeleton />}>
      <UserOrganizationTableContent id={id} />
    </Suspense>
  )
}