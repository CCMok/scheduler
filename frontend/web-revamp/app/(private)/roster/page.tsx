import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/external/shadcn/components/ui/breadcrumb";
import { getTeams } from "@/libs/team/read/get-team-service";
import RosterPageContent from "./_components/roster-page-content";
import { Suspense } from "react";
import RosterPageContentSkeleton from "./_components/roster-page-content-skeleton";
import { getFirstRoster, getFirstTeamRosters } from "@/libs/roster/read/get-roster-service";

export default function RosterPage() {
  const teamsPromise = getTeams();
  const rostersPromise = getFirstTeamRosters();
  const rosterPromise = getFirstRoster();
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
        <RosterPageContent
          teamsPromise={teamsPromise}
          rostersPromise={rostersPromise}
          rosterPromise={rosterPromise}
        />
      </Suspense>
    </HeaderLayout>
  )
}