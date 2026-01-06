import FieldLayout from "@/components/_general/form/field/field-layout";
import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/external/shadcn/components/ui/breadcrumb";
import { FieldGroup, FieldSet } from "@/external/shadcn/components/ui/field";
import TeamCombobox from "./_components/team-combobox";
import { getTeams as getTeamsService } from "@/libs/team/read/get-team-service";
import { Suspense } from "react";
import InputSkeleton from "@/components/_general/_custom/skeleton/input-skeleton";

const getTeams = async () => {
  const response = await getTeamsService();
  if (!response.isSuccess) return [];
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
      <div className='space-y-4'>
        <FieldGroup>
          <FieldSet className='flex flex-row items-center'>
            <FieldLayout className='w-(--input-width)'>
              <Suspense fallback={<InputSkeleton />}> 
              <TeamCombobox teamsPromise={teamsPromise} />
              </Suspense>
            </FieldLayout>
            <span>Auto button to auto-schedule</span>
          </FieldSet>
        </FieldGroup>
        <div className='space-x-4'>
          <span>Previous button</span>
          <span>Roster Name (Click to Combobox search)</span>
          <span>Next button</span>
        </div>
        <div>
          <p>Roster table</p>
          <p>- Default show latest roster</p>
        </div>
      </div>
    </HeaderLayout>
  )
}