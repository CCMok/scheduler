'use client'

import { useArrangeRosterFilterStore } from "@/components/store/roster/arrange/filter/arrange-roster-filter-store-provider";
import { Worker } from "@/external/prisma-generated";
import { useEffect } from "react";

type Props = {
  workers: Worker[];
}

export default function RosterFilterStateUpdater({ workers }: Readonly<Props>) {
  const setWorkers = useArrangeRosterFilterStore(state => state.setWorkers);

  useEffect(() => {
    setWorkers(workers);
  }, [workers, setWorkers]);

  return <></>
}