'use client'

import { LocalStorageKey } from "@/libs/client/_general/enums/local-storage-key"
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule"
import { useEffect, useRef } from "react"
import { useArrangeRosterStore } from "./arrange-roster-store-provider"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"
import { useRouter } from "next/navigation"
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action"

export default function ArrangeRosterStoreHandler() {
  const setGeneratedScheduleDepartmentId = useArrangeRosterStore(state => state.setGeneratedScheduleDepartmentId)
  const setGeneratedScheduleWorkers = useArrangeRosterStore(state => state.setGeneratedScheduleWorkers)
  const setGeneratedScheduleOffs = useArrangeRosterStore(state => state.setGeneratedScheduleOffs)
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

      const posts = await fetchData(
        async () => await getPostsAction({
          where: { departmentId },
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
        post: posts.find(p => p.id === schedule.post.id) ?? schedule.post,
        arrangements: schedule.arrangements.map(arrangement => ({
          ...arrangement,
          day: new Date(arrangement.day),
          worker: arrangement.worker
            ? (workers.find(w => w.id === arrangement.worker?.id) ?? arrangement.worker)
            : undefined,
        })),
      }))

      const modifiedScheduleStorageString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_MODIFIED_SCHEDULES)
      if (!modifiedScheduleStorageString) return

      const modifiedScheduleStorage = JSON.parse(modifiedScheduleStorageString)
      if (!modifiedScheduleStorage.length) return

      const modifiedSchedules = modifiedScheduleStorage.map((schedule: PostBaseSchedule) => ({
        ...schedule,
        post: posts.find(p => p.id === schedule.post.id) ?? schedule.post,
        arrangements: schedule.arrangements.map(arrangement => ({
          ...arrangement,
          day: new Date(arrangement.day),
          worker: arrangement.worker
            ? (workers.find(w => w.id === arrangement.worker?.id) ?? arrangement.worker)
            : undefined,
        })),
      }))

      const offsStorageString = localStorage.getItem(LocalStorageKey.ARRANGE_ROSTER_GENERATED_OFFS)
      if (!offsStorageString) return

      const offs = JSON.parse(offsStorageString)

      setGeneratedScheduleDepartmentId(departmentId)
      setGeneratedScheduleWorkers(workers)
      setGeneratedScheduleOffs(offs)
      setInitialSchedules(initialSchedules)
      setModifiedSchedules(modifiedSchedules)
      setIsGenerated(true)
    })()
  }, [setGeneratedScheduleDepartmentId, setGeneratedScheduleWorkers, setInitialSchedules, setModifiedSchedules, setIsGenerated, router])

  return <></>
}