import { Post, Worker } from "@/external/prisma/generated/client";
import { RosterDisplay, RosterDto, RosterPost, RosterPostAssignment, RosterTimeslotAssignment } from "./roster";

export const convertToRosterDisplay = (rosterDto: RosterDto, posts: Post[], workers: Worker[]): RosterDisplay => {
  const workerMap = new Map(workers.map(worker => [worker.id, worker]))

  const postAssignmentsMap = new Map<number, { timeslot: string; workerId?: number }[]>()
  for (const { timeslot, assignments } of rosterDto) {
    for (const { postId, workerId } of assignments) {
      const existing = postAssignmentsMap.get(postId) ?? []
      postAssignmentsMap.set(postId, [...existing, { timeslot, workerId }])
    }
  }

  return posts
    .toSorted((a, b) => a.displayOrder - b.displayOrder)
    .map((post): RosterPost => ({
      post: { id: post.id, name: post.name },
      assignments: (postAssignmentsMap.get(post.id) ?? []).map(
        ({ timeslot, workerId }): RosterPostAssignment => ({
          timeslot,
          worker: workerId ? workerMap.get(workerId) : undefined,
        })
      ),
    }));
}

export const convertToRosterDto = (rosterDisplay: RosterDisplay): RosterDto => {
  const timeslotAssignmentsMap = new Map<string, RosterTimeslotAssignment[]>()
  for (const { post, assignments } of rosterDisplay) {
    for (const { timeslot, worker } of assignments) {
      const existing = timeslotAssignmentsMap.get(timeslot) ?? []
      timeslotAssignmentsMap.set(timeslot, [...existing, { postId: post.id, workerId: worker?.id }])
    }
  }

  return Array.from(timeslotAssignmentsMap.entries()).map(([timeslot, assignments]) => ({
    timeslot,
    assignments,
  }))
}