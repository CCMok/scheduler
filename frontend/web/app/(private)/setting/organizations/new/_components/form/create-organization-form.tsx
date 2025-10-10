'use client'

import { CreateOrganizationFormInput, createOrganizationFormInputSchema } from "@/libs/client/organization/models/create-organization-form-input";
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
import { CreateOrganizationRequest, PostRequest, PostWorkerRequest, WorkerRequest } from "@/libs/server/organization/models/create-organization-request";
import { createOrganizationAction } from "@/libs/server/organization/actions/create-organization-action";
import { useRouter } from "next/navigation";
import { PATH } from "@/libs/share/_general/utils/path";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
// TODO: exit page can prompt confirm?

const createRequest = (input: CreateOrganizationFormInput): CreateOrganizationRequest => {
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
    departmentName: input.departmentName,
    posts,
    workers,
    postWorkers,
  }
}

export default function CreateOrganizationForm() {
  const form = useForm({
    resolver: zodResolver(createOrganizationFormInputSchema),
    defaultValues: CREATE_ORGANIATION_DEFAULT,
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

  const onSubmit = async (input: CreateOrganizationFormInput) => {
    const request = createRequest(input);
    const response = await createOrganizationAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path));
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success('新增組織' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.push(PATH.setting.organizations.base)
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