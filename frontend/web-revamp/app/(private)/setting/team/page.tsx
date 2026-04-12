import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import TeamSelector from "./_components/team-selector";
import TeamDetailPanel from "./_components/team-detail-panel";
import { getTeams } from "@/libs/team/read/get-team-service";

export default function TeamSettingPage() {
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
      <div className='space-y-2'>
        <TeamSelector teamsPromise={getTeams()} />
        <TeamDetailPanel />
      </div>
    </HeaderLayout>
  )
}