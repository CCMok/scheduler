import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/external/shadcn/components/ui/breadcrumb";
import { getTeams as getTeamsService } from "@/libs/team/read/get-team-service";
import RosterPageContent from "./_components/roster-page-content";
import { Suspense } from "react";
import RosterPageContentSkeleton from "./_components/roster-page-content-skeleton";

const getTeams = async () => {
  const response = await getTeamsService();
  if (!response.isSuccess) {
    console.error('Fail to get teams');
    console.error(response.message);
    return [];
  }
  return response.data;
}

export default function RosterPage() {
  const teamsPromise = getTeams();
  return (
    <HeaderLayout
      title={(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>值班表</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    >
      <Suspense fallback={<RosterPageContentSkeleton />}>
        <RosterPageContent teamsPromise={teamsPromise} />
      </Suspense>
    </HeaderLayout>
  )
}