import HeaderLayout from '@/components/_general/header/header-layout'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/external/shadcn/components/ui/breadcrumb'
import { getTeams } from '@/libs/team/read/get-team-service'
import { getPosts } from '@/libs/post/read/get-post-service'
import { getWorkers } from '@/libs/worker/read/get-worker-service'
import type { Post, Worker } from '@/external/prisma/generated/client'
import { SearchParam, searchParamKey } from '../_components/param'
import { isNil } from 'lodash'
import CreateWorkspaceShell from '../_components/workspace/create-workspace-shell'
import { ROUTE } from '@/libs/_general/route/route-config'
import Link from 'next/link'

export default async function RosterNewPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<SearchParam>
}>) {
  const params = await searchParams
  const teamIdParam = Number.parseInt(params.teamId ?? '')

  const teams = await getTeams()
  const teamId = teams.some((t) => t.id === teamIdParam)
    ? teamIdParam
    : teams[0]?.id

  const [posts, workers] = isNil(teamId)
    ? ([[], []] as [Post[], Worker[]])
    : await Promise.all([getPosts(teamId), getWorkers(teamId)])

  return (
    <HeaderLayout
      title={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={
                    isNil(teamId)
                      ? ROUTE.private.roster.base()
                      : ROUTE.private.roster.base({
                          [searchParamKey.TEAM_ID]: teamId,
                        })
                  }
                >
                  值班表
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>新建</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
    >
      <CreateWorkspaceShell
        teams={teams}
        posts={posts}
        workers={workers}
        teamId={teamId}
      />
    </HeaderLayout>
  )
}
