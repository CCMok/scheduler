'use client'

import { CreateOrganizationFormInput, createOrganizationFormInputSchema } from "@/app/(private)/setting/organizations/new/_components/form/create-organization-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CREATE_ORGANIATION_DEFAULT } from "./create-organization-default-value";
import { useState } from "react";
import { Form } from "@/external/shadcn/components/ui/form";
import BasicInfoSection from "./basic-info/basic-info-section";
import { CreateOrganizationRequest } from "@/libs/organization/models/create-organization-request";
import { createOrganizationAction } from "@/libs/organization/actions/create-organization-action";
import { useRouter } from "next/navigation";
import { PATH } from "@/libs/_general/enums/path";
import { toast } from "sonner";
import { SONNER_DEFAULT_OPTIONS } from "@/libs/_general/constants/sonnar-constant";
import { PostRequest, PostWorkerRequest, WorkerRequest } from "@/libs/department/models/create-department-request";
import { createPostsRequest, createPostWorkersRequest, createWorkersRequest } from "../../../[orgId]/departments/new/_components/create-department-request-utils";
import DependencyHandler from "../../../[orgId]/departments/new/_components/form/dependency-handler";
import { CreateDepartmentStepContent } from "../../../[orgId]/departments/new/_components/form/create-department-step-content";
import { handleCudResponse } from "@/libs/_general/utils/response-utils";
import { isNil } from "lodash";
import { MessageTitle } from "@/libs/_general/enums/message";

const createRequest = (input: CreateOrganizationFormInput): CreateOrganizationRequest => {
  const posts: PostRequest[] = createPostsRequest(input.posts)
  const workers: WorkerRequest[] = createWorkersRequest(input.workers)
  const postWorkers: PostWorkerRequest[] = createPostWorkersRequest(input.postWorkers, input.workers)

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

  const onSubmit = async (input: CreateOrganizationFormInput) => {
    const request = createRequest(input);
    const response = await createOrganizationAction(request)

    const data = handleCudResponse(response, router.push)
    if (isNil(data)) return;

    toast.success('新增機構' + MessageTitle.SUCCESS, {
      ...SONNER_DEFAULT_OPTIONS,
    })

    router.push(PATH.setting.organizations.base)
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