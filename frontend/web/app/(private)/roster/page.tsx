import HeaderLayout from "@/components/_general/header/header-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/external/shadcn/components/ui/breadcrumb";
import { getTeams } from "@/libs/team/read/get-team-service";
import WorkspaceShell from "./_components/workspace/workspace-shell";
import {
  getRosterById,
  getRosters,
} from "@/libs/roster/read/get-roster-service";
import { getPosts } from "@/libs/post/read/get-post-service";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import type { Post, Roster, Worker } from "@/external/prisma/generated/client";
import { SearchParam, searchParamKey } from "./_components/param";
import { isNil } from "lodash";
import { redirect } from "next/navigation";
import { ROUTE } from "@/libs/_general/route/route-config";

export default async function RosterPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParam>;
}>) {
  const params = await searchParams;
  const teamIdParam = Number.parseInt(params.teamId ?? "");

  // Legacy create URL → dedicated create page
  if (params.rosterId === "new") {
    redirect(
      ROUTE.private.roster.new(
        Number.isFinite(teamIdParam)
          ? { [searchParamKey.TEAM_ID]: teamIdParam }
          : undefined,
      ),
    );
  }

  const rosterIdParam = Number.parseInt(params.rosterId ?? "");

  const teams = await getTeams();
  const teamId = teams.some((t) => t.id === teamIdParam)
    ? teamIdParam
    : teams[0]?.id;

  const [rosters, posts, workers] = isNil(teamId)
    ? ([[], [], []] as [Roster[], Post[], Worker[]])
    : await Promise.all([
        getRosters(teamId),
        getPosts(teamId),
        getWorkers(teamId),
      ]);

  // Prefer URL rosterId (list may lag right after create); require same team.
  const urlRosterId =
    Number.isFinite(rosterIdParam) && rosterIdParam > 0
      ? rosterIdParam
      : undefined;
  const urlRoster = isNil(urlRosterId)
    ? undefined
    : await getRosterById(urlRosterId);
  const rosterFromUrl =
    urlRoster && !isNil(teamId) && urlRoster.teamId === teamId
      ? urlRoster
      : undefined;
  const roster =
    rosterFromUrl ??
    (isNil(rosters[0]?.id) ? undefined : await getRosterById(rosters[0].id));
  const rosterId = roster?.id;

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
      <WorkspaceShell
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
