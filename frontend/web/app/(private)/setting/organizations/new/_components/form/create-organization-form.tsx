'use client'

import { CreateOrganizationWithChildrenFormInput, createOrganizationWithChildrenFormInputSchema } from "@/libs/client/organization/models/create-organization-with-children-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CREATE_ORGANIATION_DEFAULT } from "./create-organization-default-value";
import { useState } from "react";
import { Form } from "@/external/shadcn/components/ui/form";
import BasicInfoSection from "./basic-info/basic-info-section";
import PostsSection from "./posts/posts-section";
import WorkersSection from "./workers/workers-section";
import PostWorkerSection from "./post-worker/post-worker-section";
import DependencyHandler from "./dependency-handler";
import { CreateOrganizationWithChildrenRequest, PostRequest, PostWorkerRequest, WorkerRequest } from "@/libs/server/organization/models/create-organization-with-children-request";
import { createOrganizationWithChildrenAction } from "@/libs/server/organization/actions/create-organization-with-children-action";
// TODO: remove create dialog
// TODO: exit page can prompt confirm?

export default function CreateOrganizationForm() {
  const form = useForm({
    resolver: zodResolver(createOrganizationWithChildrenFormInputSchema),
    defaultValues: CREATE_ORGANIATION_DEFAULT,
  })

  const [step, setStep] = useState(0)

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <BasicInfoSection onClickNext={() => setStep(step => step + 1)} />
      case 1:
        return <PostsSection
          onClickNext={() => setStep(step => step + 1)}
          onClickPrevious={() => setStep(step => step - 1)}
        />
      case 2:
        return <WorkersSection
          onClickNext={() => setStep(step => step + 1)}
          onClickPrevious={() => setStep(step => step - 1)}
        />
      case 3:
        return <PostWorkerSection
          onClickPrevious={() => setStep(step => step - 1)}
        />
      default:
        return <></>
    }
  }

  const onSubmit = async (input: CreateOrganizationWithChildrenFormInput) => {
    const posts: PostRequest[] = input.posts.map(post => ({
      name: post.name,
    }))

    const workers: WorkerRequest[] = input.workers.map(worker => ({
      name: worker.name,
    }))

    const postWorkers: PostWorkerRequest[] = input.postWorkers.map(postWorker => ({
      postName: postWorker.postName,
      workerNames: postWorker.workerTempIds.map(workerTempId =>
        input.workers.find(worker => worker.tempId === workerTempId)?.name ?? ''
      ),
    }))

    const request: CreateOrganizationWithChildrenRequest = {
      name: input.name,
      departmentName: input.departmentName,
      posts,
      workers,
      postWorkers,
    }

    await createOrganizationWithChildrenAction(request)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DependencyHandler />
        {getStepContent(step)}
      </form>
    </Form>
  )
}