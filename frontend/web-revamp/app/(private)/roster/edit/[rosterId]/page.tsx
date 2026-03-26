import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import { notFound } from "next/navigation";
import { Param } from "./_components/param";
import { getRosterById } from "@/libs/roster/read/get-roster-service";
import { isNil } from "lodash";
import { Separator } from "@/external/shadcn/components/ui/separator";
import H2 from "@/components/_general/_custom/typography/h2";
import H3 from "@/components/_general/_custom/typography/h3";
import { getPosts } from "@/libs/post/read/get-post-service";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import RosterEditForm from "./_components/roster-edit-form";
import { ROUTE } from "@/libs/_general/route/route";

export default async function RosterEditPage({
  params,
}: Readonly<{
  params: Promise<Param>;
}>) {
  const { rosterId } = await params
  const rosterIdNum = Number.parseInt(rosterId)
  if (Number.isNaN(rosterIdNum)) notFound()

  const roster = await getRosterById(rosterIdNum)
  if (isNil(roster)) notFound()

  return (
    <HeaderLayout
      title={(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={ROUTE.private.roster.base()}>值班表</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>更改</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    >
      <div className="space-y-3">
        <div>
          <H2>{roster.name}</H2>
          <Separator className="mt-2 mb-4" />
        </div>
        <div className="space-y-3">
          <H3>更改值班表</H3>
          <p className='text-sm text-muted-foreground'>離開頁面後，未儲存的修改將會遺失。</p>
        </div>
        <RosterEditForm
          roster={roster}
          postsPromise={getPosts(roster.teamId)}
          workersPromise={getWorkers(roster.teamId)}
        />
      </div>
    </HeaderLayout>
  )
}