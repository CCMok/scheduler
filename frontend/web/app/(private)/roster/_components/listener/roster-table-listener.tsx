'use client'

import { useArrangeRosterStore } from "@/components/store/roster/arrange/arrange-roster-store-provider"
import { useEffect } from "react";

export default function RosterTableListener() {
  const { departmentId } = useArrangeRosterStore(state => state);

  useEffect(() => {
    if (!departmentId) return;

    // TODO
  }, [departmentId])

  return (
    <></>
  )
}