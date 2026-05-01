import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import TeamSelector from "./_components/team-selector";
import TeamDetailPanel from "./_components/team-detail-panel";
import { getTeamById, getTeams } from "@/libs/team/read/get-team-service";
import { SearchParam } from "./_components/param";
import { Team } from "@/external/prisma/generated/client";

export default async function TeamSettingPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParam>;
}>) {
  const awaitedParams = await searchParams;
  const teamId = Number.parseInt(awaitedParams.teamId ?? '');

  let team: Team | undefined;
  if (!Number.isNaN(teamId)) {
    team = await getTeamById(teamId);
  }

  return (
    <HeaderLayout
      title={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>設定</BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>團隊</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <div className='space-y-2 h-full'>
        <TeamSelector teamsPromise={getTeams()} />
        {team && <TeamDetailPanel team={team} />}
      </div>
    </HeaderLayout>
  )
}