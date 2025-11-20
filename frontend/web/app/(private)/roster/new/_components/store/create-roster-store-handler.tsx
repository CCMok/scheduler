'use client'

import { LocalStorageKey } from "@/libs/_general/enums/local-storage-key"
import { PostBaseArrangement, PostBaseSchedule } from "@/libs/roster/models/schedule"
import { useEffect, useRef } from "react"
import { useCreateRosterStore } from "./create-roster-store-provider"
import { getWorkersAction } from "@/libs/worker/actions/get-workers-action"
import { useRouter } from "next/navigation"
import { getPostsAction } from "@/libs/post/actions/get-posts-action"
import { handleGetResponse } from "@/libs/_general/utils/response-utils"
import { Post, Worker } from "@/external/prisma-generated"
import { OffFormInput } from "../filter/form/create-roster-form-input"

function mapArrangements(
  arrangements: PostBaseArrangement[],
  workers: Worker[],
) {
  return arrangements.map(arrangement => ({
    ...arrangement,
    day: new Date(arrangement.day),
    worker: arrangement.worker
      ? (workers.find(w => w.id === arrangement.worker?.id) ?? arrangement.worker)
      : undefined,
  }))
}

function transformSchedule(
  schedule: PostBaseSchedule,
  posts: Post[],
  workers: Worker[],
): PostBaseSchedule {
  return {
    ...schedule,
    post: posts.find(p => p.id === schedule.post.id) ?? schedule.post,
    arrangements: mapArrangements(schedule.arrangements, workers),
  }
}

const mapOffs = (offs: OffFormInput[]): OffFormInput[] => {
  return offs.map(off => ({
    ...off,
    days: off.days.map(day => new Date(day)),
  }))
}

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

      const getWorkersResponse = await getWorkersAction(undefined, departmentId)
      const workers = handleGetResponse(getWorkersResponse, router.push, [])

      const getPostsResponse = await getPostsAction(undefined, departmentId)
      const posts = handleGetResponse(getPostsResponse, router.push, [])

      const initialScheduleStorageString = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_INITIAL_SCHEDULES)
      if (!initialScheduleStorageString) return

      const initialScheduleStorage = JSON.parse(initialScheduleStorageString)
      if (!initialScheduleStorage.length) return

      const initialSchedules = initialScheduleStorage.map((schedule: PostBaseSchedule) =>
        transformSchedule(schedule, posts, workers)
      )

      const modifiedScheduleStorageString = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_MODIFIED_SCHEDULES)
      if (!modifiedScheduleStorageString) return

      const modifiedScheduleStorage = JSON.parse(modifiedScheduleStorageString)
      if (!modifiedScheduleStorage.length) return

      const modifiedSchedules = modifiedScheduleStorage.map((schedule: PostBaseSchedule) =>
        transformSchedule(schedule, posts, workers)
      )

      const offsStorageString = localStorage.getItem(LocalStorageKey.CREATE_ROSTER_GENERATED_OFFS)
      if (!offsStorageString) return

      const offs = JSON.parse(offsStorageString) as OffFormInput[];
      const mappedOffs = mapOffs(offs)

      setGeneratedScheduleDepartmentId(departmentId)
      setGeneratedScheduleWorkers(workers)
      setGeneratedScheduleOffs(mappedOffs)
      setInitialSchedules(initialSchedules)
      setModifiedSchedules(modifiedSchedules)
      setIsGenerated(true)
    })()
  }, [setGeneratedScheduleDepartmentId, setGeneratedScheduleWorkers, setGeneratedScheduleOffs, setInitialSchedules, setModifiedSchedules, setIsGenerated, router])

  return <></>
}