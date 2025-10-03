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
    (async () => {
      if (firstRendered.current) return
      firstRendered.current = true
  
      const departmentIdStorageString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_GENERATED_DEPARTMENT_ID)
      if (!departmentIdStorageString) return
  
      const departmentId = Number(departmentIdStorageString)
      if (!departmentId) return

      const workers = await fetchData(
        async () => await getWorkersAction({
          where: { departmentId },
          orderBys: [{ field: 'name' }],
        }),
        path => router.push(path),
        [],
      )
  
      const initialScheduleStorageString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_INITIAL_SCHEDULES)
      if (!initialScheduleStorageString) return
  
      const initialScheduleStorage = JSON.parse(initialScheduleStorageString)
      if (!initialScheduleStorage.length) return
      
      const initialSchedules = initialScheduleStorage.map((schedule: PostBaseSchedule) => ({
        ...schedule,
        arrangements: schedule.arrangements.map(arrangement => ({
          ...arrangement,
          day: new Date(arrangement.day),
        })),
      }))

      const modifiedScheduleStorageString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_MODIFIED_SCHEDULES)
      if (!modifiedScheduleStorageString) return
  
      const modifiedScheduleStorage = JSON.parse(modifiedScheduleStorageString)
      if (!modifiedScheduleStorage.length) return
      
      const modifiedSchedules = modifiedScheduleStorage.map((schedule: PostBaseSchedule) => ({
        ...schedule,
        arrangements: schedule.arrangements.map(arrangement => ({
          ...arrangement,
          day: new Date(arrangement.day),
        })),
      }))
  
      setGeneratedScheduleDepartmentId(departmentId)
      setGeneratedScheduleWorkers(workers)
      setInitialSchedules(initialSchedules)
      setModifiedSchedules(modifiedSchedules)
      setIsGenerated(true)
    })()
  }, [setGeneratedScheduleDepartmentId, setGeneratedScheduleWorkers, setInitialSchedules, setModifiedSchedules, setIsGenerated, router])

  return <></>
}