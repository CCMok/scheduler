'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CREATE_DEPARTMENT_DEFAULT } from "./create-department-default-value";
import { useState } from "react";
import { Form } from "@/external/shadcn/components/ui/form";
import BasicInfoSection from "./basic-info/basic-info-section";
import PostsSection from "./posts/posts-section";
import WorkersSection from "./workers/workers-section";
import PostWorkerSection from "./post-worker/post-worker-section";
import DependencyHandler from "./dependency-handler";
import { PostRequest, PostWorkerRequest, WorkerRequest } from "@/libs/server/organization/models/create-organization-request";
import { useRouter } from "next/navigation";
import { createDepartmentFormInputSchema, CreateDepartmentFormInput } from "@/libs/client/department/models/create-department-form-input";
import { CreateDepartmentRequest } from "@/libs/server/department/models/create-department-request";

const createRequest = (input: CreateDepartmentFormInput): CreateDepartmentRequest => {
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

  return {
    name: input.name,
    posts,
    workers,
    postWorkers,
  }
}

export default function CreateDepartmentForm() {
  const form = useForm({
    resolver: zodResolver(createDepartmentFormInputSchema),
    defaultValues: CREATE_DEPARTMENT_DEFAULT,
  })

  const router = useRouter();

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
// TODO
  const onSubmit = async (input: CreateDepartmentFormInput) => {
    // const request = createRequest(input);
    // const response = await createOrganizationAction(request)

    // const uiResponse = handleServiceResponse(response, path => router.push(path));
    // if (!uiResponse.isSuccess) {
    //   toast.error(uiResponse.message.title, {
    //     ...SONNER_DEFAULT_OPTIONS,
    //     description: uiResponse.message.content,
    //   })
    //   return
    // }

    // toast.success('新增組織' + UiMessageTitle.SUCCESS, {
    //   ...SONNER_DEFAULT_OPTIONS,
    // })

    // router.push(PATH.setting.organizations.base)
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