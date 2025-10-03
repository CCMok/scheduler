'use client'

import { LocalStorageKey } from "@/libs/client/_general/enums/local-storage-key"
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule"
import { useEffect, useRef } from "react"
import { useArrangeRosterStore } from "./arrange-roster-store-provider"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"
import { useRouter } from "next/navigation"

export default function ArrangeRosterStoreHandler() {
  const setGeneratedScheduleDepartmentId = useArrangeRosterStore(state => state.setGeneratedScheduleDepartmentId)
  const setGeneratedScheduleWorkers = useArrangeRosterStore(state => state.setGeneratedScheduleWorkers)
  const setInitialSchedules = useArrangeRosterStore(state => state.setInitialSchedules)
  const setModifiedSchedules = useArrangeRosterStore(state => state.setModifiedSchedules)
  const setIsGenerated = useArrangeRosterStore(state => state.setIsGenerated)

  const router = useRouter()

  const firstRendered = useRef<boolean>(false)

  useEffect(() => {
    if (firstRendered.current) return

    firstRendered.current = true

    const scheduleStorageString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_SCHEDULES)
    if (!scheduleStorageString) return

    const scheduleStorage = JSON.parse(scheduleStorageString)
    if (!scheduleStorage.length) return
    
    const schedules = scheduleStorage.map((schedule: PostBaseSchedule) => ({
      ...schedule,
      arrangements: schedule.arrangements.map(arrangement => ({
        ...arrangement,
        day: new Date(arrangement.day),
      })),
    }))

    const departmentIdStorageString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_GENERATED_DEPARTMENT_ID)
    if (!departmentIdStorageString) return

    const departmentId = Number(departmentIdStorageString)
    if (!departmentId) return

    (async () => {
      const workers = await fetchData(
        async () => await getWorkersAction({
          where: { departmentId },
          orderBys: [{ field: 'name' }],
        }),
        path => router.push(path),
        [],
      )
  
      setGeneratedScheduleDepartmentId(departmentId)
      setGeneratedScheduleWorkers(workers)
      setInitialSchedules(schedules)
      setModifiedSchedules(schedules)
      setIsGenerated(true)
    })()
  }, [setGeneratedScheduleDepartmentId, setGeneratedScheduleWorkers, setInitialSchedules, setModifiedSchedules, setIsGenerated])

  return <></>
}