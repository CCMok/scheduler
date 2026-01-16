import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import { Path } from "@/libs/_general/path/path";
import TeamTitle from "./_components/team-title";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TitleSkeleton from "@/components/_general/_custom/skeleton/title-skeleton";
import { Separator } from "@/external/shadcn/components/ui/separator";
import StepControl from "./_components/step-control/step-control";
import { getWorkers } from "@/libs/worker/read/get-worker-service";
import { AutoNewRosterStoreProvider } from "./_components/step-control/step/store/auto-new-roster-store-provider";
import { getPosts } from "@/libs/post/read/get-post-service";

export default async function RosterAutoNewPage({
  params,
}: Readonly<{
  params: Promise<{ teamId: string }>;
}>) {
  const { teamId } = await params
  const teamIdNum = Number.parseInt(teamId)
  if (Number.isNaN(teamIdNum)) notFound()

  const workersPromise = getWorkers(teamIdNum)
  const postsPromise = getPosts(teamIdNum)

  return (
    <HeaderLayout
      title={(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={Path.ROSTER}>值班表</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>自動編排</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    >
      <div className='h-full flex flex-col'>
        <Suspense fallback={<TitleSkeleton />}>
          <TeamTitle id={teamIdNum} />
        </Suspense>
        <Separator className="mt-2 mb-4" />
        <AutoNewRosterStoreProvider>
          <StepControl
            className='flex-1'
            postPromise={postsPromise}
            workersPromise={workersPromise}
          />
        </AutoNewRosterStoreProvider>
      </div>
    </HeaderLayout>
  )
}