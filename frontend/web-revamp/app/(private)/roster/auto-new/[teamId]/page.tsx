import HeaderLayout from "@/components/_general/header/header-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/external/shadcn/components/ui/breadcrumb";
import { Path } from "@/libs/_general/path/path";
import TeamTitle from "./_components/team-title";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TitleSkeleton from "@/components/_general/_custom/skeleton/title-skeleton";

export default async function RosterAutoNewPage({
  params,
}: Readonly<{
  params: Promise<{ teamId: string }>;
}>) {
  const { teamId } = await params
  const teamIdNum = Number(teamId)
  if (Number.isNaN(teamIdNum)) notFound()
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
              <BreadcrumbPage>自動排班</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
    >
      <Suspense fallback={<TitleSkeleton />}>
        <TeamTitle id={teamIdNum} />
      </Suspense>
    </HeaderLayout>
  )
}