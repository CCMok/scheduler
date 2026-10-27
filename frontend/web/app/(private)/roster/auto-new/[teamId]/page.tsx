import { redirect } from "next/navigation";
import { ROUTE } from "@/libs/_general/route/route-config";
import { searchParamKey } from "../../_components/param";

type Param = { teamId: string };

/** Legacy wizard URL → Workspace create. */
export default async function AutoNewRedirectPage({
  params,
}: Readonly<{
  params: Promise<Param>;
}>) {
  const { teamId } = await params;
  redirect(
    ROUTE.private.roster.base({
      [searchParamKey.TEAM_ID]: teamId,
      [searchParamKey.ROSTER_ID]: "new",
    }),
  );
}
