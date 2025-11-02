'use client'

import { LocalStorageKey } from "@/libs/client/_general/enums/local-storage-key"
import { PostBaseSchedule } from "@/libs/share/roster/models/post-base-schedule"
import { useEffect, useRef } from "react"
import { useCreateRosterStore } from "./create-roster-store-provider"
import { fetchData } from "@/libs/share/_general/utils/fetch"
import { getWorkersAction } from "@/libs/server/worker/actions/get-workers-action"
import { useRouter } from "next/navigation"
import { getPostsAction } from "@/libs/server/post/actions/get-posts-action"
import { handleGetResponse } from "@/libs/server/_general/utils/response-utils"

export default function CreateRosterStoreHandler() {
  const setGeneratedScheduleDepartmentId = useCreateRosterStore(state => state.setGeneratedScheduleDepartmentId)
  const setGeneratedScheduleWorkers = useCreateRosterStore(state => state.setGeneratedScheduleWorkers)
  const setGeneratedScheduleOffs = useCreateRosterStore(state => state.setGeneratedScheduleOffs)
  const setInitialSchedules = useCreateRosterStore(state => state.setInitialSchedules)
  const setModifiedSchedules = useCreateRosterStore(state => state.setModifiedSchedules)
  const setIsGenerated = useCreateRosterStore(state => state.setIsGenerated)

  const router = useRouter()

  const firstRendered = useRef<boolean>(false)

  useEffect(() => {
    (async () => {
      if (firstRendered.current) return
      firstRendered.current = true

      const departmentIdStorageString = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_GENERATED_DEPARTMENT_ID)
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

      const response = await getPostsAction(undefined, departmentId)
      const posts = handleGetResponse(response, router.push, [])

      const initialScheduleStorageString = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_INITIAL_SCHEDULES)
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

      const modifiedScheduleStorageString = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_MODIFIED_SCHEDULES)
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

      const offsStorageString = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_GENERATED_OFFS)
      if (!offsStorageString) return

      const offs = JSON.parse(offsStorageString)

      setGeneratedScheduleDepartmentId(departmentId)
      setGeneratedScheduleWorkers(workers)
      setGeneratedScheduleOffs(offs)
      setInitialSchedules(initialSchedules)
      setModifiedSchedules(modifiedSchedules)
      setIsGenerated(true)
    })()
  }, [setGeneratedScheduleDepartmentId, setGeneratedScheduleWorkers, setGeneratedScheduleOffs, setInitialSchedules, setModifiedSchedules, setIsGenerated, router])

  return <></>
}