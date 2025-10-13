'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CREATE_DEPARTMENT_DEFAULT } from "./create-department-default-value";
import { useState } from "react";
import { Form } from "@/external/shadcn/components/ui/form";
import BasicInfoSection from "./basic-info/basic-info-section";
import DependencyHandler from "./dependency-handler";
import { useParams, useRouter } from "next/navigation";
import { createDepartmentFormInputSchema, CreateDepartmentFormInput } from "@/libs/client/department/models/create-department-form-input";
import { CreateDepartmentRequest, PostRequest, PostWorkerRequest, WorkerRequest } from "@/libs/server/department/models/create-department-request";
import { createDepartmentAction } from "@/libs/server/department/actions/create-department-action";
import { Param } from "@/libs/share/_general/enums/param";
import { handleServiceResponse } from "@/libs/share/_general/utils/service-response-handler";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/client/_general/constants/sonnar-constant";
import { UiMessageTitle } from "@/libs/share/_general/enums/ui-message";
import { PATH } from "@/libs/share/_general/utils/path";
import { OrganizationPageTabId } from "../../../../tab-id";
import { createPostsRequest, createPostWorkersRequest, createWorkersRequest } from "../create-department-request-utils";
import { CreateDepartmentStepContent } from "./create-department-step-content";

const createRequest = (input: CreateDepartmentFormInput, organizationId: number): CreateDepartmentRequest => {
  const posts: PostRequest[] = createPostsRequest(input.posts)
  const workers: WorkerRequest[] = createWorkersRequest(input.workers)
  const postWorkers: PostWorkerRequest[] = createPostWorkersRequest(input.postWorkers, input.workers)

  return {
    organizationId,
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

  const params = useParams()
  const organizationId = Number(params[Param.ORG_ID]);

  const [step, setStep] = useState(0)

  const onSubmit = async (input: CreateDepartmentFormInput) => {
    if (isNaN(organizationId)) {
      console.error(`organizationId is not found. organizationId: ${organizationId}`)
      return
    }

    const request = createRequest(input, organizationId);
    const response = await createDepartmentAction(request)

    const uiResponse = handleServiceResponse(response, path => router.push(path));
    if (!uiResponse.isSuccess) {
      toast.error(uiResponse.message.title, {
        ...SONNER_DEFAULT_OPTIONS,
        description: uiResponse.message.content,
      })
      return
    }

    toast.success('新增部門' + UiMessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.push(`${PATH.setting.organizations.build(organizationId)}?${Param.TAB}=${OrganizationPageTabId.DEPARTMENTS}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DependencyHandler />
        <CreateDepartmentStepContent
          step={step}
          setStep={setStep}
          basicInfoSection={<BasicInfoSection onClickNext={() => setStep(step => step + 1)} />}
        />
      </form>
    </Form>
  )
}