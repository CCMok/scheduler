import { Post, Worker } from "@/external/prisma/generated/client";
import { PostBaseRoster, RosterDto, RosterPost } from "./roster";

export const convertToPostBaseRoster = (rosterDto: RosterDto, posts: Post[], workers: Worker[]): PostBaseRoster => {
  const postMap = getPostMap(posts)
  const workerMap = getWorkerMap(workers)
  const rosterPostMap = getRosterPostMap(rosterDto)
  // map to PostBaseRoster
}

const getPostMap = (posts: Post[]): Map<number, Post> => {
  return new Map(posts.map(post => [post.id, post]))
}

const getWorkerMap = (workers: Worker[]): Map<number, Worker> => {
  return new Map(workers.map(worker => [worker.id, worker]))
}

type RosterPostMapValue = {
  timeslot: string;
  workerId?: number;
}

const getRosterPostMap = (rosterDto: RosterDto): Map<number, RosterPostMapValue[]> => {
  const rosterPostMap = new Map<number, { timeslot: string; workerId?: number }[]>()

  for (const rosterTimeslot of rosterDto.timeslots) {
    for (const rosterTimeslotAssignment of rosterTimeslot.assignments) {
      const rosterPostAssignments = rosterPostMap.get(rosterTimeslotAssignment.postId) ?? []
      rosterPostMap.set(rosterTimeslotAssignment.postId, [
        ...rosterPostAssignments,
        { timeslot: rosterTimeslot.timeslot, workerId: rosterTimeslotAssignment.workerId },
      ])
    }
  }

  return rosterPostMap;
}

const getPostBaseRoster = (
  postMap: Map<number, Post>,
  workerMap: Map<number, Worker>,
  rosterPostMap: Map<number, RosterPostMapValue[]>,
): PostBaseRoster => {
  const postBaseRoster: PostBaseRoster = []

  for (const [postId, rosterPostAssignments] of rosterPostMap.entries()) {
    const post = postMap.get(postId)
    if (!post) {
      console.error('PostId not found. postId=', postId)
      continue;
    }

    // TODO
    // for (const rosterPostAssignment of rosterPostAssignments) {
    //   if (rosterPostAssignment.workerId) {
    //     const worker = workerMap.get(rosterPostAssignment.workerId)
    //     if (!worker) {
    //       console.error('WorkerId not found. workerId=', rosterPostAssignment.workerId)
    //       continue;
    //     }
    //   }

    //   const worker = workerMap.get(rosterPostAssignment.workerId)
    // }

    // const postBaseRosterPost: RosterPost = {
    //   post: {
    //     id: post.id,
    //     name: post.name,
    //   },
    //   assignments: rosterPostAssignments.map(r => ({
    //     timeslot: r.timeslot,
    //     worker: r.workerId ? workerMap.get(r.workerId) : undefined,
    //   })),
    // }

    // postBaseRoster.push(postBaseRosterPost)
  }

  return postBaseRoster;
}