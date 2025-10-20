'use client'

import dynamic from "next/dynamic";

// Fix dnd hydration mismatch
const RosterTable = dynamic(() => import('../../../new/_components/table/roster-table'), { ssr: false })

export default function RosterTableClientContainer() {
  return (
    <RosterTable />
  )
}