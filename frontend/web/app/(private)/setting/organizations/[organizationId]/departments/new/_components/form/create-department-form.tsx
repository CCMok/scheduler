'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CREATE_DEPARTMENT_DEFAULT } from "./create-department-default-value";
import { useState } from "react";
import { Form } from "@/external/shadcn/components/ui/form";
import BasicInfoSection from "./basic-info/basic-info-section";
import DependencyHandler from "./dependency-handler";
import { useRouter } from "next/navigation";
import { createDepartmentFormInputSchema, CreateDepartmentFormInput } from "@/libs/department/models/create-department-form-input";
import { CreateDepartmentRequest, PostRequest, PostWorkerRequest, WorkerRequest } from "@/libs/department/models/create-department-request";
import { createDepartmentAction } from "@/libs/department/actions/create-department-action";
import { Param } from "@/libs/_general/enums/param";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { PATH } from "@/libs/_general/enums/path";
import { OrganizationPageTabId } from "../../../../tab-id";
import { createPostsRequest, createPostWorkersRequest, createWorkersRequest } from "../create-department-request-utils";
import { CreateDepartmentStepContent } from "./create-department-step-content";
import { handleCudResponse } from "@/libs/_general/utils/response-utils";
import { isNil } from "lodash";
import { MessageTitle } from "@/libs/_general/enums/message";

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

type Props = {
  organizationId: number;
}

export default function CreateDepartmentForm({
  organizationId,
}: Readonly<Props>) {
  const form = useForm({
    resolver: zodResolver(createDepartmentFormInputSchema),
    defaultValues: CREATE_DEPARTMENT_DEFAULT,
  })

  const router = useRouter();

  const [step, setStep] = useState(0)

  const onSubmit = async (input: CreateDepartmentFormInput) => {
    const request = createRequest(input, organizationId);
    const response = await createDepartmentAction(request)

    const departmentId = handleCudResponse(response, router.push)
    if (isNil(departmentId)) return;

    toast.success('新增部門' + MessageTitle.SUCCESS, {
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