import SidebarInsetLayout from "@/components/_general/layout/sidebar-inset/sidebar-inset-layout"
import { Param } from "@/libs/_general/enums/param"
import { ParamProps } from "@/libs/_general/props/param-props"
import { PATH } from "@/libs/_general/enums/path"
import { notFound } from "next/navigation"
import RosterHistoryName from "./_components/table/roster-history-name"
import RosterTableSection from "./_components/table/roster-table-section"

type Props = ParamProps<{ [Param.ROSTER_HISTORY_ID]: string }>

export default async function RosterHistoryPage({
  params,
}: Readonly<Props>) {
  const awaitedParams = await params;

  const id = Number.parseInt(awaitedParams[Param.ROSTER_HISTORY_ID]);
  if (Number.isNaN(id)) notFound();

  return (
    <SidebarInsetLayout breadcrumbItems={[
      {
        key: 'roster',
        label: '值班表',
      },
      {
        key: 'histories',
        label: '紀錄',
        href: PATH.roster.histories.base,
      },
      {
        key: 'history',
        label: <RosterHistoryName id={id} />
      },
    ]}>
      <RosterTableSection rosterHistoryId={id} />
    </SidebarInsetLayout>
  )
}