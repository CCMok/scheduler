'use client'

import { CreateOrganizationFormInput, PostWorkerFormInput } from "@/libs/client/organization/models/create-organization-form-input"
import { useFormContext, useWatch } from "react-hook-form"
import { DEFAULT_POSTS, DEFAULT_WORKERS } from "./create-organization-default-value"
import { useEffect } from "react"

const useHandlePosts = () => {
  const { control, getValues, setValue, resetField } = useFormContext<CreateOrganizationFormInput>()

  const posts = useWatch({
    control,
    name: 'posts',
    defaultValue: DEFAULT_POSTS,
  })

  useEffect(() => {
    const currentPostWorkers = getValues('postWorkers');

    // Updated postWorkers
    const filteredPostWorkers = currentPostWorkers.filter(postWorker => posts.some(post => post.tempId === postWorker.postTempId));

    const updatedPostWorkers: PostWorkerFormInput[] = filteredPostWorkers.map(postWorker => {
      const post = posts.find(post => post.tempId === postWorker.postTempId);
      if (!post) return postWorker;

      return {
        ...postWorker,
        postName: post.name,
      };
    });

    // New PostWorkers
    const newPosts = posts.filter(post => !currentPostWorkers.some(postWorker => postWorker.postTempId === post.tempId))

    const newPostWorkers: PostWorkerFormInput[] = newPosts.map(post => ({
      postTempId: post.tempId,
      postName: post.name,
      workerTempIds: [],
    }))

    const resultPostWorkers = [...updatedPostWorkers, ...newPostWorkers];

    setValue('postWorkers', resultPostWorkers);
    resetField('postWorkers', {
      defaultValue: resultPostWorkers,
    })
  }, [posts, getValues, setValue, resetField])
}

const useHandleWorkers = () => {
  const { control, getValues, setValue, resetField } = useFormContext<CreateOrganizationFormInput>()

  const workers = useWatch({
    control,
    name: 'workers',
    defaultValue: DEFAULT_WORKERS,
  })

  useEffect(() => {
    const postWorkers = getValues('postWorkers');

    const isWorkerValid = (workerTempId: string) => workers.some(worker => worker.tempId === workerTempId);

    const updatedPostWorkers: PostWorkerFormInput[] = postWorkers.map(postWorker => ({
      ...postWorker,
      workerTempIds: postWorker.workerTempIds.filter(isWorkerValid),
    }))

    setValue('postWorkers', updatedPostWorkers);
    resetField('postWorkers', {
      defaultValue: updatedPostWorkers,
    })
  }, [workers, getValues, setValue, resetField])
}

export default function DependencyHandler() {
  useHandlePosts()
  useHandleWorkers()
  return <></>
}