'use client'

import { createOrganizationWithChildrenFormInputSchema } from "@/libs/client/organization/models/create-organization-with-children-form-input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CREATE_ORGANIATION_DEFAULT } from "./create-organization-default-value";
import { useState } from "react";
import { Form } from "@/external/shadcn/components/ui/form";
import OrganizationBasicInfoSection from "./basic-info/organization-basic-info-section";
import PostsSection from "./posts/posts-section";
import WorkersSection from "./workers/workers-section";
// TODO: remove create dialog

export default function CreateOrganizationForm() {
  const form = useForm({
    resolver: zodResolver(createOrganizationWithChildrenFormInputSchema),
    defaultValues: CREATE_ORGANIATION_DEFAULT,
  })

  const [step, setStep] = useState(0)

  const onSubmit = () => {
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <OrganizationBasicInfoSection onClickNext={() => setStep(step => step + 1)} />
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
      default:
        return <></>
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {getStepContent(step)}
      </form>
    </Form>
  )
}