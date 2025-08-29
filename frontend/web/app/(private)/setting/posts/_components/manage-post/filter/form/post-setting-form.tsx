'use client'

import { Form } from "@/external/shadcn/components/ui/form"
import { postSettingFormInputSchema } from "@/libs/client/post/models/post-setting-form-input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import PostSettingFilter from "../post-setting-filter"
import PostSettingFormDependencyHandler from "./post-setting-form-dependency-handler"
import { getDefaultDepartmentIdInOrganizations, getDefaultOrganizationId } from "@/libs/client/organization/utils/organization-utils"
import { usePostSettingFilterStore } from "@/app/(private)/setting/posts/_components/manage-post/filter/store/post-setting-filter-store-provider"
import FormRootMessage from "@/components/form/form-root-message"

export default function PostSettingForm() {
  const organizations = usePostSettingFilterStore(state => state.organizations);

  const form = useForm({
    resolver: zodResolver(postSettingFormInputSchema),
    defaultValues: {
      organizationId: getDefaultOrganizationId(organizations),
      departmentId: getDefaultDepartmentIdInOrganizations(organizations),
    },
  })

  return (
    <Form {...form}>
      <form className="space-y-4">
        <PostSettingFormDependencyHandler />
        <PostSettingFilter />
        <FormRootMessage />
      </form>
    </Form>
  )
}