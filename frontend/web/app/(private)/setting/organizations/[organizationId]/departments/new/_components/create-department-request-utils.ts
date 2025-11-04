import { PostFormInput, PostWorkerFormInput, WorkerFormInput } from "@/libs/department/models/create-department-form-input"
import { PostRequest, PostWorkerRequest, WorkerRequest } from "@/libs/department/models/create-department-request"

export const createPostsRequest = (posts: PostFormInput[]): PostRequest[] => {
  return posts.map(post => ({
    name: post.name,
  }))
}

export const createWorkersRequest = (workers: WorkerFormInput[]): WorkerRequest[] => {
  return workers.map(worker => ({
    name: worker.name,
  }))
}

export const createPostWorkersRequest = (postWorkers: PostWorkerFormInput[], workers: WorkerFormInput[]): PostWorkerRequest[] => {
  return postWorkers.map(postWorker => ({
    postName: postWorker.postName,
    workerNames: postWorker.workerTempIds.map(workerTempId =>
      workers.find(worker => worker.tempId === workerTempId)?.name ?? ''
    ),
  }))
}