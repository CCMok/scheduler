import { redirect } from "next/navigation";
import { ROUTE } from "@/libs/_general/route/route-config";
import { searchParamKey } from "../../_components/param";
import { getRosterById } from "@/libs/roster/read/get-roster-service";

type Param = { rosterId: string };

/** Legacy edit URL → Workspace. */
export default async function EditRedirectPage({
  params,
}: Readonly<{
  params: Promise<Param>;
}>) {
  const { rosterId: rosterIdRaw } = await params;
  const rosterId = Number.parseInt(rosterIdRaw, 10);
  if (Number.isNaN(rosterId)) {
    redirect(ROUTE.private.roster.base());
  }

  const roster = await getRosterById(rosterId);
  if (!roster) {
    redirect(ROUTE.private.roster.base());
  }

  redirect(
    ROUTE.private.roster.base({
      [searchParamKey.TEAM_ID]: roster.teamId,
      [searchParamKey.ROSTER_ID]: roster.id,
    }),
  );
}
