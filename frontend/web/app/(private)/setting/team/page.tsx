import HeaderLayout from "@/components/_general/header/header-layout";
import SettingPageIntro from "@/components/_general/setting/setting-page-intro";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import TeamSelector from "./_components/team-selector";
import TeamDetailPanel from "./_components/team-detail-panel";
import { getTeamById, getTeams } from "@/libs/team/read/get-team-service";
import { SearchParam } from "./_components/param";
import { isNil } from "lodash";

export default async function TeamSettingPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParam>;
}>) {
  const awaitedParams = await searchParams;
  const teamIdParam = Number.parseInt(awaitedParams.teamId ?? "");

  const teams = await getTeams();
  const teamId = teams.some((t) => t.id === teamIdParam)
    ? teamIdParam
    : teams[0]?.id;

  const team = isNil(teamId) ? undefined : await getTeamById(teamId);

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
      <div className="flex h-full min-h-0 flex-col gap-3">
        <SettingPageIntro
          title="團隊設定"
          support="管理職員、職位、偏好與基本資料。"
        />
        <TeamSelector teams={teams} teamId={teamId} />
        {team ? <TeamDetailPanel team={team} className="min-h-0 flex-1" /> : null}
      </div>
    </HeaderLayout>
  )
}
