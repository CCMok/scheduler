import HeaderLayout from "@/components/_general/header/header-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/external/shadcn/components/ui/breadcrumb";
import { getTeams } from "@/libs/team/read/get-team-service";
import RosterPageContent from "./_components/roster-page-content";
import {
  getRosterById,
  getRosters,
} from "@/libs/roster/read/get-roster-service";
import { getPosts } from "@/libs/post/read/get-post-service";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import type { Post, Roster, Worker } from "@/external/prisma/generated/client";
import { SearchParam } from "./_components/param";
import { isNil } from "lodash";

export default async function RosterPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParam>;
}>) {
  const params = await searchParams;
  const teamIdParam = Number.parseInt(params.teamId ?? '');
  const rosterIdParam = Number.parseInt(params.rosterId ?? '');

  const teams = await getTeams();
  const teamId = teams.some((t) => t.id === teamIdParam) ? teamIdParam : teams[0]?.id;

  const [rosters, posts, workers] = isNil(teamId)
    ? [[], [], []] as [Roster[], Post[], Worker[]]
    : await Promise.all([getRosters(teamId), getPosts(teamId), getWorkers(teamId)]);

  const rosterId = rosters.some((r) => r.id === rosterIdParam) ? rosterIdParam : rosters[0]?.id;
  const roster = isNil(rosterId) ? undefined : await getRosterById(rosterId);

  return (
    <HeaderLayout
      title={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>值班表</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <RosterPageContent
        teams={teams}
        rosters={rosters}
        roster={roster}
        posts={posts}
        workers={workers}
        teamId={teamId}
        rosterId={rosterId}
      />
    </HeaderLayout>
  );
}
